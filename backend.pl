# backend for PatchbayVIPS
# Aug.25 by daniel boehringer
# Copyright 2025, All rights reserved.
#

use Mojolicious::Lite;
use Mojo::Pg;
use Data::Dumper;
use Mojo::File;
use Mojo::JSON qw(decode_json encode_json);
use Encode; # utf8 and friends
use Mojo::Template;
use Text::CSV;
use Statistics::R;
use Archive::Zip qw( :ERROR_CODES :CONSTANTS );
use File::Basename 'fileparse'; # Import fileparse directly
use Data::UUID;
use Cwd 'abs_path';
use Fcntl qw(:flock); # For file locking to prevent race conditions

no warnings 'uninitialized';

helper pg => sub { state $pg = Mojo::Pg->new('postgresql://postgres@localhost/vips_patchbay') };

my $IMAGE_STORE_DIR = Mojo::File->new('./image_store')->make_path->to_abs;
my $THUMBNAIL_DIR = $IMAGE_STORE_DIR->child('thumbnails')->make_path;

# turn browser cache off
hook after_dispatch => sub {
    my $tx = shift;
    my $e = Mojo::Date->new(time-100);
    $tx->res->headers->header(Expires => $e);
    $tx->res->headers->header('X-ARGOS-Routing' => '3036');
};

post '/VIPS/upload' => sub {
    my $self    = shift;
    my $uploads = $self->req->uploads('files[]');
    my $ug      = Data::UUID->new;

    for my $upload (@$uploads) {
        my $original_filename = $upload->filename;
        # Extract the extension to preserve it
        my ($name, $path, $ext) = fileparse($original_filename, qr/\.[^.]*/);
        $ext //= ''; # Handle files with no extension gracefully

        my $uuid_str          = $ug->create_str();
        # New filename is uuid + original extension
        my $destination_filename = $uuid_str . $ext;
        my $destination_path  = $IMAGE_STORE_DIR->child($destination_filename);

        # Store file on disk with UUID.ext as name
        $upload->move_to($destination_path);

        # Record in the database with the base UUID
        $self->pg->db->insert('input_images', {
            uuid              => $uuid_str,
            original_filename => $original_filename
        });
    }

    $self->render(status => 200, json => { message => "Upload complete." });
};

# --- (in backend.pl) ---

# New helper to find an image path by its base UUID, regardless of extension
helper find_image_path_by_uuid => sub {
    my ($self, $uuid) = @_;
    # Basic validation to ensure we're looking for a UUID-like string
    return undef unless $uuid && $uuid =~ /^[0-9a-f\-]{36}$/i;

    # Use Mojo::File's list which is safer and more portable than glob.
    # It finds the first file that starts with "uuid."
    my $found_file = $IMAGE_STORE_DIR->list({dir => 0})->first(sub {
        $_->basename =~ /^\Q$uuid\E(\.|$)/
    });

    return $found_file;
};


# REPLACEMENT for the /VIPS/preview/:uuid route
get '/VIPS/preview/:uuid' => [uuid => qr/[0-9a-f\-]+/i] => sub {
    my $self = shift;
    my $uuid = $self->param('uuid');
    my $width = $self->param('w');

    # Find the source file by its base UUID, regardless of extension
    my $source_file = $self->find_image_path_by_uuid($uuid);

    # Security check is implicitly handled by the helper, just check for existence
    unless ($source_file && -e $source_file) {
        return $self->render(status => 404, text => 'Not Found');
    }

    # If no width is specified, serve the original full-resolution image
    unless ($width) {
        return $self->reply->file($source_file);
    }

    # --- On-demand Thumbnail Generation Logic ---

    # Sanitize the width parameter
    $width = int($width);
    if ($width <= 0 || $width > 4096) { # Set a reasonable max size
        return $self->render(status => 400, text => 'Invalid width parameter');
    }

    # Define the path for the cached thumbnail
    my $thumbnail_filename = "${uuid}_w${width}.jpg"; # Use jpg for thumbnails for good compression
    my $thumbnail_path = $THUMBNAIL_DIR->child($thumbnail_filename);

    # Cache Hit: If the thumbnail already exists, serve it immediately.
    if (-e $thumbnail_path) {
        return $self->reply->file($thumbnail_path);
    }

    # Cache Miss: Generate the thumbnail.
    # We use a lock file to prevent multiple web workers from trying to
    # generate the same thumbnail simultaneously if many requests arrive at once.
    my $lock_path = $thumbnail_path . '.lock';
    open my $lock_fh, '>', $lock_path or die "Cannot open lock file $lock_path: $!";
    flock($lock_fh, LOCK_EX);

    # After acquiring the lock, check again if another process created the file while we waited.
    if (-e $thumbnail_path) {
        flock($lock_fh, LOCK_UN);
        close $lock_fh;
        return $self->reply->file($thumbnail_path);
    }

    # Use the 'vips thumbnail' command, which is highly optimized for this task.
    # It's faster and uses less memory than 'vips resize'.
    my $command = sprintf(
    'vips thumbnail %s %s %d --height 10000 --auto-rotate --size=both',
    $source_file,
    $thumbnail_path,
    $width
    );
    # The high --height value ensures we constrain by width while maintaining aspect ratio.

    app->log->debug("Generating thumbnail: $command");
    my $output = `$command 2>&1`;

    # Clean up the lock file
    flock($lock_fh, LOCK_UN);
    close $lock_fh;
    unlink $lock_path;

    if ($? != 0 || !-e $thumbnail_path) {
        app->log->error("Thumbnail generation failed for $uuid (width $width): $output");
        return $self->render(status => 500, text => 'Thumbnail generation failed');
    }

    # Finally, serve the newly created thumbnail
    return $self->reply->file($thumbnail_path);
};

get '/VIPS/list_images' => sub {
    my $self = shift;
    my $images = $self->pg->db->query(q{
        SELECT original_filename as name, uuid, '/VIPS/preview/' || uuid as url
        FROM input_images
        ORDER BY upload_timestamp DESC
    })->hashes;
    $self->render(json => $images);
};

get '/VIPS/output_images' => sub {
    my $self = shift;
    my @files = $IMAGE_STORE_DIR->list({dir => 0})->each;
    my @images;
    for my $file (@files) {
        # Parse basename to extract the UUID part without the extension
        my ($uuid_part) = fileparse($file->basename, qr/\.[^.]*/);
        push @images, { uuid => $uuid_part };
    }
    $self->render(json => \@images);
};

get '/VIPS/output_images/:input_uuid' => [input_uuid => qr/[0-9a-f\-]+/i] => sub {
    my $self = shift;
    $self->render(text => '');
};

post '/VIPS/run' => sub {
    my $self = shift;
    my $json_body = $self->req->json;
    my $idproject = $json_body->{idproject};
    my $input_uuid = $json_body->{input_uuid}; # Frontend now sends the selected UUID

    my $block = $self->pg->db->query('select blocks.id from blocks join blocks_catalogue on idblock =  blocks_catalogue.id where idproject = ? and outputs is null', $idproject)->hash;

    # The input to the graph is now a UUID
    my $result_uuid = $self->get_result_of_block_id($block->{id}, $input_uuid);

    if ($result_uuid) {
        $self->render(json => { result_uuid => $result_uuid, url => "/VIPS/preview/$result_uuid" });
    } else {
        $self->render(status => 500, json => { error => "Pipeline execution failed." });
    }
};

get '/VIPS/block/:block_id/image/:input_uuid' => [block_id => qr/\d+/, input_uuid => qr/[0-9a-f\-]+/i] => sub {
    my $self = shift;
    my $block_id = $self->param('block_id');
    my $input_uuid = $self->param('input_uuid');

    my $result_uuid = $self->get_result_of_block_id($block_id, $input_uuid);

    if ($result_uuid) {
        my $image_file = $self->find_image_path_by_uuid($result_uuid);
        if ($image_file && -e $image_file) {
            return $self->reply->file($image_file);
        }
    }

    return $self->render(status => 404, text => 'Image not found');
};

get '/VIPS/project/:projectid/image/:input_uuid' => [projectid => qr/\d+/, input_uuid => qr/[0-9a-f\-]+/i] => sub {
    my $self = shift;
    my $projectid = $self->param('projectid');
    my $input_uuid = $self->param('input_uuid');

    my $block = $self->pg->db->query('select blocks.id from blocks join blocks_catalogue on idblock =  blocks_catalogue.id where idproject = ? and outputs is null', $projectid)->hash;
    unless ($block && $block->{id}) {
        return $self->render(status => 404, json => { error => "Output block not found for project $projectid" });
    }

    warn Dumper $block;
    my $result_uuid = $self->get_result_of_block_id($block->{id}, $input_uuid);
    warn $result_uuid;

    unless ($result_uuid) {
        return $self->render(status => 500, json => { error => "Pipeline execution failed for input $input_uuid." });
    }

    my $image_file = $self->find_image_path_by_uuid($result_uuid);

    unless ($image_file && -e $image_file) {
        $self->app->log->error("Processing finished, but result file not found for UUID: $result_uuid");
        return $self->render(status => 404, text => 'Result image not found on disk.');
    }

    # 1. Create a temporary file object.
    my $temp = File::Temp->new( SUFFIX => '.png', UNLINK => 1 );
    my $temp_filename = $temp->filename;

    # 2. Build the command to write to the temporary file.
    my @cmd = ('vips', 'pngsave', $image_file->to_string, $temp_filename);

    # 3. Execute the command.
    my $error_output = `@cmd 2>&1`;

    # 4. Check the exit status.
    if ($? != 0) {
        $self->app->log->error("Failed to convert final image to PNG. VIPS said: $error_output");
        return $self->render(status => 500, text => "Failed to generate preview image.");
    }

    # 5. Read the binary data from the temp file.
    open(my $fh, '<:raw', $temp_filename) or do {
        $self->app->log->error("Could not open temp file '$temp_filename' for reading: $!");
        return $self->render(status => 500, text => "Server error reading temporary image.");
    };
    my $png_data;
    {
        local $/ = undef; # Slurp mode
        $png_data = <$fh>;
    }
    close $fh;

    # 6. Send the image data to the browser.
    $self->res->headers->content_type('image/png');
    return $self->render(data => $png_data);
};

get '/VIPS/project/:projectid/outputs' => [projectid => qr/\d+/] => sub {
    my $self = shift;
    my $projectid = $self->param('projectid');

    my $input_images = $self->pg->db->query('SELECT uuid FROM input_images ORDER BY upload_timestamp DESC')->hashes;

    my @outputs;
    for my $image (@$input_images) {
        push @outputs, {
            url => "/VIPS/project/$projectid/image/" . $image->{uuid},
            uuid => $image->{uuid}
        };
    }

    $self->render(json => \@outputs);
};


#
# begin: generic DBI interface (CRUD)
#
# fetch all entities

get '/VIPS/blocks/idproject/:key' => [key => qr/[0-9]+/i] => sub
{
    my $self = shift;
    my $key  = $self->param('key');

    $self->render(json => $self->pg->db->select('blocks', [qw/*/], {idproject => $key})->hashes);
};

get '/VIPS/:table'=> sub
{
    my $self    = shift;
    my $table   = $self->param('table');


    if ($table eq 'blocks')
    {
        $self->render(json => $self->pg->db->select($table, [qw/*/])->hashes);
        return;
    }

    $self->render(json => $self->pg->db->select($table, [qw/*/])->hashes);
};

# fetch entities by key/value

get '/VIPS/settings/id/:key' => [key => qr/[a-z0-9\s\-_\.]+/i] => sub
{
    my $self = shift;
    my $id = $self->param('key');
    my $block = $self->pg->db->query(q{select output_value, gui_fields from blocks join blocks_catalogue on idblock = blocks_catalogue.id where blocks.id = ?}, $id)->hash;
    $block->{output_value} = '{}' unless $block->{output_value};

    my $out = $block->{gui_fields} ? decode_json($block->{output_value}) : {};
    $out->{id} = $id;
    $self->render(json => [$out]);
};

put '/VIPS/settings/id/:key' => [key => qr/[a-z0-9\s\-_\.]+/i] => sub
{
    my $self = shift;
    my $id = $self->param('key');
    my $block = $self->pg->db->query(q{select output_value, gui_fields from blocks join blocks_catalogue on idblock = blocks_catalogue.id where blocks.id = ?}, $id)->hash;
    $block->{output_value} = '{}' unless $block->{output_value};
    my $out = decode_json($block->{output_value});
    my $patch = $self->req->json;

    foreach my $key (keys %{$patch})
    {
        $out->{$key} = $patch->{$key};
    }

    $self->pg->db->update('blocks', {output_value => encode_json $out}, {id => $id});
    $self->render(json => {err => $DBI::errstr});
};

get '/VIPS/:table/:col/:key' => [col => qr/[a-z_0-9\s]+/i, key => qr/[a-z0-9\s\-_\.]+/i] => sub
{
    my $self = shift;
    $self->render(json => $self->pg->db->select($self->param('table'), [qw/*/], {$self->param('col') => $self->param('key')})->hashes);
};


# update
put '/VIPS/:table/:pk/:key' => [key => qr/\d+/] => sub
{
    my $self    = shift;
    $self->pg->db->update($self->param('table'), $self->req->json, {$self->param('pk') => $self->param('key')});
    $self->render(json => {err => $DBI::errstr});
};

# insert
post '/VIPS/:table/:pk'=> sub
{
    my $self    = shift;
    my $table   = $self->param('table');
    my $u       = $self->req->json;

    $u->{name}    = 'New dataset'          if !$u->{name}    && $table eq 'embedded_datasets';
    $u->{name}    = 'New prompt'           if !$u->{name}    && $table eq 'projects';
    $u->{content} = 'Content goes here...' if !$u->{content} && $table eq 'input_data';

    my $id = $self->pg->db->insert($table, $u, {returning => $self->param('pk')})->hash->{id};

    $self->render(json => {err => $DBI::errstr, pk => $id});
};

# delete
del '/VIPS/:table/:pk/:key' => [key=>qr/\d+/] => sub
{   my $self    = shift;
    my $id      = $self->param('key');
    my $table   = $self->param('table');
    $self->pg->db->delete($table, {$self->param('pk') => $id});

    $self->render(json => {err => $DBI::errstr});
};
#
# end: generic DBI interface
#

helper get_result_of_block_id => sub {
    my ($self, $id, $initial_input_uuid, $cache_dict) = @_;
    $cache_dict //= {}; # Memoization for recursive calls within a single run

    return $cache_dict->{$id} if exists $cache_dict->{$id};

    my $block_info = $self->pg->db->query(q{
                                                SELECT
                                                bc.name,
                                                bc.command,
                                                bc.parameter_template,
                                                bc.parameter_mappings,
                                                bc.gui_fields,
                                                b.connections,
                                                b.output_value
                                                FROM blocks b
                                                JOIN blocks_catalogue bc ON b.idblock = bc.id
                                                WHERE b.id = ?
                                            }, $id)->hash;

    my $conn     = decode_json($block_info->{connections} || '{}');
    my $settings = decode_json($block_info->{output_value} || '{}');
    $block_info->{parameter_mappings} = decode_json($block_info->{parameter_mappings} || '{}');

    # --- Handle special, non-command blocks first ---
    if ($block_info->{name} eq 'Input') {
        return $cache_dict->{$id} = $initial_input_uuid;
    }

    if ($block_info->{name} eq 'Load Image') {
        my $filename = $settings->{filename};
        my $res = $self->pg->db->query('SELECT uuid FROM input_images WHERE original_filename = ?', $filename)->hash;
        return $cache_dict->{$id} = $res->{uuid};
    }

    if ($block_info->{name} eq 'Image Preview') {
        app->log->debug("Handling Image Preview block $id. Passing through input.");
        my @input_keys = keys %$conn;
        if (@input_keys != 1) {
            app->log->error("Image Preview block $id has " . scalar(@input_keys) . " inputs, but expected 1.");
            return undef;
        }
        my $input_block_id = $conn->{$input_keys[0]};
        my $input_uuid = $self->get_result_of_block_id($input_block_id, $initial_input_uuid, $cache_dict);
        return $cache_dict->{$id} = $input_uuid;
    }

    # --- General Command Execution Logic ---

    # 1. Resolve inputs by recursively calling this helper
    my @input_uuids;
    for my $key (sort keys %$conn) {
        my $input_uuid = $self->get_result_of_block_id($conn->{$key}, $initial_input_uuid, $cache_dict);
        return undef unless $input_uuid;
        push @input_uuids, $input_uuid;
    }

    # 2. Check for cached result
    my $params_json = encode_json($settings);
    my $inputs_json = encode_json(\@input_uuids);

    my $cached = $self->pg->db->query(
                                        'SELECT uuid FROM image_cache WHERE idblock = ? AND parameters_json = ? AND input_uuids_json = ?',
                                        $id, $params_json, $inputs_json
                                        )->hash;

    if ($cached) {
        my $cached_uuid = $cached->{uuid};
        # Find the cached file on disk using the helper
        my $cached_file = $self->find_image_path_by_uuid($cached_uuid);

        # VERIFY that the cached file actually exists on disk.
        if ($cached_file && -e $cached_file) {
            app->log->debug("Cache HIT for block $id (file verified)");
            return $cache_dict->{$id} = $cached_uuid;
        }
        else {
            # The cache is stale. The file is missing.
            app->log->warn("STALE CACHE: Hit for block $id, but file for UUID '$cached_uuid' is missing. Deleting entry and reprocessing.");
            # Delete the orphaned entry to self-heal the cache.
            $self->pg->db->query('DELETE FROM image_cache WHERE uuid = ?', $cached_uuid);
        }
    }
    app->log->debug("Cache MISS for block $id");

    # 3. Cache Miss: Prepare and execute the command
    my $ug = Data::UUID->new;
    my $output_uuid = $ug->create_str();

    # 3a. Build parameter lists
    my %mapped_settings;
    for my $key (keys %$settings) {
        my $value = $settings->{$key};
        $mapped_settings{$key} = $block_info->{parameter_mappings}->{$key}->{$value} // $value;
    }
    my @positional_param_values;
    my $param_template = $block_info->{parameter_template} || '';
    my @optional_flag_names = ($param_template =~ /--(\S+)/g);
    my %optional_keys_hash = map { my $k = $_; $k =~ s/-/_/g; ($k => 1) } @optional_flag_names;
    my @all_gui_fields = @{decode_json($block_info->{gui_fields} || '[]')};
    for my $key (@all_gui_fields) {
        push @positional_param_values, $mapped_settings{$key} unless exists $optional_keys_hash{$key};
    }
    my @optional_param_values;
    for my $flag_name (@optional_flag_names) {
        my $key_name = $flag_name; $key_name =~ s/-/_/g;
        push @optional_param_values, $mapped_settings{$key_name} if exists $mapped_settings{$key_name};
    }
    my $formatted_optionals = @optional_param_values ? sprintf($param_template, @optional_param_values) : '';

    # 3b. Resolve input UUIDs to full file paths
    my @input_file_paths;
    for my $input_uuid (@input_uuids) {
        my $input_file = $self->find_image_path_by_uuid($input_uuid);
        unless ($input_file && -e $input_file) {
            app->log->error("Processing error: Input file for UUID $input_uuid not found for block $id");
            return undef;
        }
        push @input_file_paths, $input_file->to_string;
    }

    # 3c. Define output path. All generated images will be PNGs.
    my $final_output_path = $IMAGE_STORE_DIR->child($output_uuid . '.png');

    # 3d. Build and execute the command. Per request, we write directly to the final path.
    # NOTE: This is less safe than writing to a temp file and renaming, as an interruption
    # could leave a corrupt file at the final destination.

    # The array of @input_file_paths is placed directly into the command parts.
    # This ensures that each input file is treated as a separate argument.
    my @command_parts = ($block_info->{command}, $block_info->{name}, @input_file_paths, $final_output_path, @positional_param_values, $formatted_optionals);
    my $command = join ' ', grep { defined && $_ ne '' } @command_parts;

    app->log->debug("Executing command: $command");
    my $output = `$command 2>&1`;

    # Check for success by looking for the final file.
    if ($? != 0 || !-e $final_output_path) {
        app->log->error("Command failed: $command");
        app->log->error("Output: $output");
        unlink $final_output_path->to_string if -e $final_output_path; # Clean up partial file
        return undef;
    }

    # 4. Store result in cache
    $self->pg->db->insert('image_cache', { uuid => $output_uuid, idblock => $id, parameters_json => $params_json, input_uuids_json => $inputs_json });

    return $cache_dict->{$id} = $output_uuid;
};

###################################################################
# main()

app->config(hypnotoad => {listen => ['http://*:3036'], workers => 2, heartbeat_timeout => 12000, inactivity_timeout => 12000});

app->start;
