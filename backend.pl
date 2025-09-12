# backend for PatchbayVIPS
# Aug.25 by daniel boehringer
# Copyright 2025, All rights reserved.
#

use Mojolicious::Lite -signatures;
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
use Text::ParseWords qw(shellwords);
use Mojo::Promise;
use Mojo::IOLoop;
use File::Temp (); # Use the core File::Temp module for temporary files

no warnings 'uninitialized';

helper pg => sub { state $pg = Mojo::Pg->new('postgresql://postgres@localhost/vips_patchbay') };

helper get_output_block => sub {
    my ($self, $project_id) = @_;
    return $self->pg->db->query(
        q{SELECT b.id FROM blocks b JOIN blocks_catalogue bc ON b.idblock = bc.id WHERE b.idproject = ? AND bc.outputs IS NULL AND bc.name NOT IN ('Label')},
        $project_id
    )->hash;
};

my $IMAGE_STORE_DIR = Mojo::File->new('./image_store')->make_path->to_abs;
my $CACHED_IMAGE_DIR = $IMAGE_STORE_DIR->child('cached_images')->make_path;
my $STATELESS_TEMP_DIR = $IMAGE_STORE_DIR->child('stateless_temp')->make_path;


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
        my ($name, $path, $ext) = fileparse($original_filename, qr/\.[^.]*/);
        $ext //= ''; # Handle files with no extension gracefully

        my $uuid_str = lc $ug->create_str();
        my $destination_filename = $uuid_str . '.png';
        my $destination_path = $IMAGE_STORE_DIR->child($destination_filename);

        # If not a PNG, convert it
        if (lc($ext) ne '.png') {
            my $temp_path = $STATELESS_TEMP_DIR->child($uuid_str . $ext);
            $upload->move_to($temp_path);

            my @cmd = ('vips', 'pngsave', $temp_path->to_string, $destination_path->to_string);
            my $output = `@cmd 2>&1`;

            if ($? != 0) {
                $self->app->log->error("VIPS conversion failed for '$original_filename': $output");
                unlink $temp_path if -e $temp_path;
                next; # Skip to the next file
            }
            unlink $temp_path;
        } else {
            # It's already a PNG, just move it.
            $upload->move_to($destination_path);
        }

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
    # Allow UUIDs that might have been created as temporary file names
    return undef unless $uuid;

    # Define all directories to search in order of priority
    my @search_dirs = ($IMAGE_STORE_DIR, $CACHED_IMAGE_DIR, $STATELESS_TEMP_DIR);

    for my $dir (@search_dirs) {
        my $found_file = $dir->list({dir => 0})->first(sub {
            $_->basename =~ /^\Q$uuid\E(\.|$)/i
        });
        return $found_file if $found_file;
    }

    return undef; # Return undef if not found in any directory
};


helper run_stateless_pipeline => sub {
    my ($c, $block_id, $input_uuid, $processing_cache, $temp_files_list) = @_;

    my $cache_key = "$block_id:$input_uuid";
    return $processing_cache->{$cache_key} if exists $processing_cache->{$cache_key};

    my $block_info = $c->pg->db->query(q{
                                            SELECT
                                            bc.name, bc.command, bc.parameter_template, bc.parameter_mappings, bc.gui_fields,
                                            b.connections, b.output_value, b.enabled
                                            FROM blocks b JOIN blocks_catalogue bc ON b.idblock = bc.id
                                            WHERE b.id = ?
                                        }, $block_id)->hash;

    unless ($block_info) {
        $c->app->log->error("Stateless pipeline: Block ID $block_id not found.");
        return undef;
    }

    my $conn = decode_json($block_info->{connections} || '{}');
    my $settings;
    eval { $settings = decode_json($block_info->{output_value} || '{}'); };
    $settings = {} if $@;
    $block_info->{parameter_mappings} = decode_json($block_info->{parameter_mappings} || '{}');

    if (defined $block_info->{enabled} && $block_info->{enabled} == 0) {
        my @input_keys = sort keys %$conn;
        return undef unless @input_keys;
        my $input_block_id = $conn->{$input_keys[0]};
        return $c->run_stateless_pipeline($input_block_id, $input_uuid, $processing_cache, $temp_files_list);
    }

    # --- BASE CASES ---
    if ($block_info->{name} eq 'Input') {
        return $input_uuid;
    }
    if ($block_info->{name} eq 'Load Image') {
        my $filename = $settings->{filename};
        my $res = $c->pg->db->query('SELECT uuid FROM input_images WHERE original_filename = ?', $filename)->hash;
        return $res ? $res->{uuid} : undef;
    }

    # --- SPECIAL BLOCK HANDLING (Restored from async helper) ---
    if ($block_info->{name} eq 'Image Preview') {
        my @input_keys = keys %$conn;
        unless (@input_keys == 1) {
            $c->app->log->error("Stateless: Image Preview block $block_id requires exactly one input.");
            return undef;
        }
        my $input_block_id = $conn->{$input_keys[0]};
        return $c->run_stateless_pipeline($input_block_id, $input_uuid, $processing_cache, $temp_files_list);
    }

    if ($block_info->{name} eq 'Exec Block') {
        my $sub_project_name = $block_info->{output_value};
        my $sub_project = $c->pg->db->query('SELECT id FROM projects WHERE name = ?', $sub_project_name)->hash;
        unless ($sub_project && $sub_project->{id}) {
            $c->app->log->error("Stateless: Sub-project '$sub_project_name' not found.");
            return undef;
        }
        my $output_block = $c->get_output_block($sub_project->{id});
        unless ($output_block && $output_block->{id}) {
            $c->app->log->error("Stateless: Output block for sub-project '$sub_project_name' not found.");
            return undef;
        }
        my @input_keys = keys %$conn;
        unless (@input_keys == 1) {
            $c->app->log->error("Stateless: Exec Block $block_id requires exactly one input.");
            return undef;
        }
        my $input_block_id = $conn->{$input_keys[0]};
        my $sub_project_input_uuid = $c->run_stateless_pipeline($input_block_id, $input_uuid, $processing_cache, $temp_files_list);
        return undef unless $sub_project_input_uuid;

        return $c->run_stateless_pipeline($output_block->{id}, $sub_project_input_uuid, $processing_cache, $temp_files_list);
    }

    # --- RECURSIVE STEP ---
    my @input_uuids;
    for my $input_key (sort keys %$conn) {
        my $input_block_id = $conn->{$input_key};
        my $result_uuid = $c->run_stateless_pipeline($input_block_id, $input_uuid, $processing_cache, $temp_files_list);
        unless($result_uuid) {
            $c->app->log->error("Stateless: Failed to get input from upstream block $input_block_id for target $block_id.");
            return undef;
        }
        push @input_uuids, $result_uuid;
    }

    # --- COMMAND EXECUTION ---
    my $ug = Data::UUID->new;
    my $output_uuid = lc $ug->create_str();

    my %mapped_settings;
    for my $key (keys %$settings) {
        my $value = $settings->{$key};
        $mapped_settings{$key} = $block_info->{parameter_mappings}->{$key}->{$value} // $value;
    }
    my @all_gui_fields = @{decode_json($block_info->{gui_fields} || '[]')};
    my @param_values = map { $mapped_settings{$_} } @all_gui_fields;

    # FIXED: Correctly declare variables before use
    my $param_template = $block_info->{parameter_template} || '';
    my @positional_param_values;
    my @templated_args;

    if ($param_template) {
        my $num_template_params = () = $param_template =~ /%[sd]/g;
        my $num_positional_params = @param_values - $num_template_params;
        if ($num_positional_params < 0) {
            $c->app->log->error("Stateless: Configuration error for block $block_id, not enough parameters for template.");
            return undef;
        }
        @positional_param_values = @param_values[0 .. $num_positional_params - 1] if $num_positional_params > 0;
        my @template_values = @param_values[$num_positional_params .. $#param_values];
        my $formatted_str = sprintf($param_template, @template_values);
        @templated_args = shellwords($formatted_str);
    } else {
        @positional_param_values = @param_values;
    }

    my @input_file_paths;
    for my $uuid (@input_uuids) {
        my $path = $c->find_image_path_by_uuid($uuid);
        unless ($path && -e $path) {
            $c->app->log->error("Stateless: Input file for UUID $uuid not found for block $block_id");
            return undef;
        }
        push @input_file_paths, $path->to_string;
    }

    my $output_path = $STATELESS_TEMP_DIR->child($output_uuid . '.png');
    push @$temp_files_list, $output_path;

    unless ($block_info->{command}) {
        $c->app->log->error("Stateless: Block $block_id ('$block_info->{name}') has no command to execute.");
        return undef;
    }
    my @cmd_parts = grep { defined && $_ ne '' } ($block_info->{command}, $block_info->{name}, @input_file_paths, $output_path->to_string, @positional_param_values, @templated_args);

    my $cmd_string = join ' ', map { s/'/'\\''/g; "'$_'" } @cmd_parts;
    my $output = `$cmd_string 2>&1`;

    if ($? != 0 || !-e $output_path || !-s $output_path) {
        $c->app->log->error("Stateless command failed for block $block_id: $cmd_string");
        $c->app->log->error("VIPS Output: $output");
        return undef;
    }

    $processing_cache->{$cache_key} = $output_uuid;
    return $output_uuid;
};

# REWORKED ROUTE
post '/vips/process_image_statelessly/:idproject' => [idproject => qr/\d+/] => sub {
    my $c = shift;
    my $idproject = $c->param('idproject');

    my $upload = $c->req->upload('image');
    unless ($upload && $upload->size > 0) {
        return $c->render(status => 400, json => { error => "Missing or empty 'image' file upload." });
    }

    my @temp_files_to_delete;
    $c->on(finish => sub {
        for my $file_path (@temp_files_to_delete) {
            next unless $file_path && -e $file_path;
            unlink $file_path->to_string or $c->app->log->error("Failed to cleanup temp file $file_path: $!");
        }
    });

    my $ug = Data::UUID->new;
    my $temp_input_uuid = lc $ug->create_str();
    my (undef, undef, $ext) = fileparse($upload->filename, qr/\.[^.]*/);
    my $temp_input_path = $STATELESS_TEMP_DIR->child($temp_input_uuid . ($ext // '.tmp'));
    $upload->move_to($temp_input_path);
    push @temp_files_to_delete, $temp_input_path;

    my $output_block = $c->get_output_block($idproject);
    unless ($output_block && $output_block->{id}) {
        return $c->render(status => 404, json => { error => "Final output block not found for project $idproject." });
    }

    my %processing_cache;
    my $final_output_uuid = $c->run_stateless_pipeline(
    $output_block->{id},
    $temp_input_uuid,
    \%processing_cache,
    \@temp_files_to_delete
    );

    unless ($final_output_uuid) {
        return $c->render(status => 500, json => { error => "Pipeline execution failed. Check server logs for details." });
    }

    my $final_image_path = $c->find_image_path_by_uuid($final_output_uuid);
    unless ($final_image_path && -e $final_image_path) {
        $c->app->log->error("Pipeline finished, but final file for UUID $final_output_uuid is missing.");
        return $c->render(status => 500, json => { error => "Pipeline failed to produce a file." });
    }

    my $image_data = eval { $final_image_path->slurp };
    if ($@) {
        $c->app->log->error("Could not read final image file '$final_image_path': $@");
        return $c->render(status => 500, text => "Server error reading final image.");
    }

    $c->res->headers->content_type('image/png');
    return $c->render(data => $image_data);
};

post '/VIPS/duplicate_project/:id' => [id => qr/\d+/] => sub
{
    my $self = shift;
    my $id = $self->param('id');

    # Start a transaction
    my $tx = $self->pg->db->begin;

    # 1. Duplicate the project
    my $new_project_id = $self->pg->db->query(
                                                'INSERT INTO projects (name) SELECT name || \' (copy)\' FROM projects WHERE id = ? RETURNING id',
                                                $id
                                             )->hash->{id};

    # 2. Get all blocks for the old project
    my $blocks = $self->pg->db->query('SELECT * FROM blocks WHERE idproject = ?', $id)->hashes;

    # 3. Create a mapping from old block IDs to new block IDs
    my %id_map;

    # 4. Duplicate each block
    for my $block (@$blocks) {
        my $old_block_id = $block->{id};
        my $new_block_id = $self->pg->db->query(
                                                    'INSERT INTO blocks (idblock, name, connections, output_value, "originX", "originY", idproject, auxfield, enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
                                                    $block->{idblock},
                                                    $block->{name},
                                                    $block->{connections},
                                                    $block->{output_value},
                                                    $block->{"originX"},
                                                    $block->{"originY"},
                                                    $new_project_id,
                                                    $block->{auxfield},
                                                    $block->{enabled}
                                                 )->hash->{id};
        $id_map{$old_block_id} = $new_block_id;
    }

    # 5. Update connections in the new blocks
    for my $old_block_id (keys %id_map) {
        my $new_block_id = $id_map{$old_block_id};
        my $connections = $self->pg->db->query('SELECT connections FROM blocks WHERE id = ?', $new_block_id)->hash->{connections};

        if ($connections) {
            my $decoded_connections = decode_json($connections);
            my $new_connections = {};

            for my $key (keys %$decoded_connections) {
                my $old_target_id = $decoded_connections->{$key};
                if (exists $id_map{$old_target_id}) {
                    $new_connections->{$key} = $id_map{$old_target_id};
                } else {
                    $new_connections->{$key} = $old_target_id; # Keep old ID if not in this project
                }
            }
            $self->pg->db->query('UPDATE blocks SET connections = ? WHERE id = ?', encode_json($new_connections), $new_block_id);
        }
    }

    # Commit the transaction
    $tx->commit;

    $self->render(json => {err => $DBI::errstr, pk => $new_project_id});
};

get '/VIPS/preview/:uuid' => [uuid => qr/[0-9a-f\-]+/i] => sub {
    my $self = shift;
    my $uuid = $self->param('uuid');

    # Find the source file by its base UUID, regardless of extension
    my $source_file = lc $self->find_image_path_by_uuid($uuid);

    # Security check is implicitly handled by the helper, just check for existence
    unless ($source_file && -e $source_file) {
        return $self->render(status => 404, text => 'Not Found');
    }
    warn $source_file;
    return $self->reply->file($source_file);
};

# route to toggle a block's enabled/disabled state and clear downstream cache
any '/VIPS/block/:block_id/toggle_enabled' => [block_id => qr/\d+/] => sub {
    my $self = shift;
    my $block_id = $self->param('block_id');
    my $db = $self->pg->db;

    # 1. Get the block's current state and its project ID
    my $block_info = $db->query('SELECT enabled, idproject FROM blocks WHERE id = ?', $block_id)->hash;
    unless ($block_info) {
        return $self->render(status => 404, json => { error => "Block with ID $block_id not found." });
    }

    # 2. Determine the new state. A NULL or undefined 'enabled' field is treated as enabled (1).
    my $new_state = (defined $block_info->{enabled} && $block_info->{enabled} == 1) ? 0 : 1;

    # 3. Update the block's state in the database
    $db->update('blocks', { enabled => $new_state }, { id => $block_id });

    # 4. If the block was just disabled, invalidate the cache by deleting the physical files.
    if ($new_state == 0) {
        my $idproject = $block_info->{idproject};
        my $all_blocks_in_project = $db->query('SELECT id, connections FROM blocks WHERE idproject = ?', $idproject)->hashes;

        # Use Breadth-First Search (BFS) to find all downstream blocks
        my @queue = ($block_id);
        my %downstream_block_ids = ($block_id => 1);

        while (my $current_id = shift @queue) {
            for my $block (@$all_blocks_in_project) {
                next if $downstream_block_ids{$block->{id}}; # Skip if already in our set
                my $connections = decode_json($block->{connections} || '{}');
                for my $input_id (values %$connections) {
                    if ($input_id == $current_id) {
                        $downstream_block_ids{$block->{id}} = 1;
                        push @queue, $block->{id};
                        last;
                    }
                }
            }
        }

        my @ids_to_clear = keys %downstream_block_ids;
        if (@ids_to_clear) {
            my $placeholders = join(',', ('?') x @ids_to_clear);

            # First, get all UUIDs from the cache for the downstream blocks.
            my $cached_entries = $db->query("SELECT uuid FROM image_cache WHERE idblock IN ($placeholders)", @ids_to_clear)->hashes;
            
            my $files_deleted_count = 0;
            for my $entry (@$cached_entries) {
                my $uuid_to_delete = $entry->{uuid};
                # Use the helper to find the physical file path.
                my $file_path = $self->find_image_path_by_uuid($uuid_to_delete);

                if ($file_path && -e $file_path) {
                    # Attempt to delete the file.
                    if (unlink $file_path) {
                        $self->app->log->debug("Deleted cached file for UUID $uuid_to_delete: $file_path");
                        $files_deleted_count++;
                    } else {
                        $self->app->log->error("Failed to delete cached file for UUID $uuid_to_delete at $file_path: $!");
                    }
                }
            }
            $self->app->log->info("Block $block_id disabled. Invalidated downstream cache by deleting $files_deleted_count physical file(s).");
        }
    }

    return $self->render(json => { success => 1, newState => $new_state });
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
    $self->render_later; # Asynchronous response

    my $json_body = $self->req->json;
    my $idproject = $json_body->{idproject};
    my $input_uuid = $json_body->{input_uuid}; # Frontend now sends the selected UUID

    my $block = $self->get_output_block($idproject);

    # The input to the graph is now a UUID
    $self->get_result_of_block_id_p($block->{id}, $input_uuid)
        ->then(sub {
            my $result_uuid = shift;
            $self->render(json => { result_uuid => $result_uuid, url => "/VIPS/preview/$result_uuid" });
        })
        ->catch(sub {
            my $err = shift;
            app->log->error("Pipeline execution failed: $err");
            $self->render(status => 500, json => { error => "Pipeline execution failed." });
        });
};


# for the image block inspector
get '/VIPS/block/:block_id/image' => [block_id => qr/\d+/i] => sub {
    my $self = shift;
    my $block_id = $self->param('block_id');

    # Query the cache for the most recently generated UUID for this specific block.
    my $cached_info = $self->pg->db->query  (
                                                'SELECT uuid FROM image_cache WHERE idblock = ? ORDER BY creation_timestamp DESC LIMIT 1',
                                                $block_id
                                            )->hash;

    unless ($cached_info && $cached_info->{uuid}) {
        return $self->render(status => 404, text => 'No cached image output exists for this block.');
    }

    my $result_uuid = $cached_info->{uuid};
    my $image_file = $self->find_image_path_by_uuid($result_uuid);

    unless ($image_file && -e $image_file) {
        $self->app->log->warn("Cache entry found for block $block_id (UUID: $result_uuid), but the file is missing.");
        return $self->render(status => 404, text => 'Cached image file is missing from disk.');
    }

    # Use File::Temp for robust temporary file creation
    my $temp = File::Temp->new( SUFFIX => '.png', UNLINK => 1 );
    my $temp_filename = $temp->filename;
    
    my @cmd = ('vips', 'pngsave', $image_file->to_string, $temp_filename);
    my $error_output = `@cmd 2>&1`;
    
    if ($? != 0) {
        $self->app->log->error("Failed to convert cached image to PNG for preview. VIPS said: $error_output");
        return $self->render(status => 500, text => "Failed to generate preview image.");
    }
    
    open(my $fh, '<:raw', $temp_filename) or do {
        $self->app->log->error("Could not open temp file '$temp_filename' for reading: $!");
        return $self->render(status => 500, text => "Server error reading temporary image.");
    };
    my $png_data;
    { local $/ = undef; $png_data = <$fh>; }
    close $fh;
    
    $self->res->headers->content_type('image/png');
    return $self->render(data => $png_data);
};

get '/VIPS/block/:block_id/image/:input_uuid' => [block_id => qr/\d+/, input_uuid => qr/[0-9a-f\-]+/i] => sub {
    my $self = shift;
    $self->render_later;
    my $block_id = $self->param('block_id');
    my $input_uuid = $self->param('input_uuid');

    $self->get_result_of_block_id_p($block_id, $input_uuid)
        ->then(sub {
            my $result_uuid = shift;

            if ($result_uuid) {
                my $image_file = $self->find_image_path_by_uuid($result_uuid);
                if ($image_file && -e $image_file) {
                    return $self->reply->file($image_file->to_string);
                }
            }
            $self->render(status => 404, text => 'Image not found');
        })
        ->catch(sub {
            my $err = shift;
            $self->app->log->error("Failed to get result for block $block_id: $err");
            $self->render(status => 500, text => 'Image processing failed');
        });
};

get '/VIPS/project/:projectid/image/:input_uuid' => [projectid => qr/\d+/, input_uuid => qr/[0-9a-f\-]+/i] => sub {
    my $self = shift;
    $self->render_later;

    my $projectid = $self->param('projectid');
    my $input_uuid = $self->param('input_uuid');

    my $block = $self->get_output_block($projectid);
    unless ($block && $block->{id}) {
        return $self->render(status => 404, json => { error => "Output block not found for project $projectid" });
    }

    $self->get_result_of_block_id_p($block->{id}, $input_uuid)
        ->then(sub {
            my $result_uuid = shift;
            unless ($result_uuid) {
                return $self->render(status => 500, json => { error => "Pipeline execution failed for input $input_uuid." });
            }

            my $image_file = $self->find_image_path_by_uuid($result_uuid);
            unless ($image_file && -e $image_file) {
                $self->app->log->error("Processing finished, but result file not found for UUID: $result_uuid");
                return $self->render(status => 404, text => 'Result image not found on disk.');
            }

            # Asynchronously convert and send the image
            my $promise = Mojo::Promise->new;
            my $temp = File::Temp->new( SUFFIX => '.png', UNLINK => 1 );
            my $temp_filename = $temp->filename;
            my @cmd = ('vips', 'pngsave', $image_file->to_string, $temp_filename);
            my $command_string = join(' ', @cmd) . ' 2>&1';

            Mojo::IOLoop->subprocess(
                sub { exec('sh', '-c', $command_string) },
                sub {
                    my ($subprocess, $err) = @_;
                    if ($err || !-e $temp_filename || !-s $temp_filename) {
                        $self->app->log->error("Failed to convert final image to PNG. VIPS said: " . ($err || 'unknown error'));
                        $promise->reject("Failed to generate preview image.");
                    } else {
                        open(my $fh, '<:raw', $temp_filename) or $promise->reject("Could not open temp file for reading: $!");
                        my $png_data;
                        { local $/ = undef; $png_data = <$fh>; }
                        close $fh;
                        $promise->resolve($png_data);
                    }
                }
            );

            return $promise;
        })
        ->then(sub {
            my $png_data = shift;
            $self->res->headers->content_type('image/png');
            $self->render(data => $png_data);
        })
        ->catch(sub {
            my $error = shift;
            $self->app->log->error("Error in image processing chain: $error");
            $self->render(status => 500, text => $error || "An unknown error occurred.");
        });
};

post '/VIPS/project/:projectid/outputs' => [projectid => qr/\d+/] => sub {
    my $self = shift;
    my $projectid = $self->param('projectid');
    my $json_body = $self->req->json;
    $self->render_later; # Asynchronous response

    my $input_uuids = $json_body->{input_uuids};

    unless ($input_uuids && ref $input_uuids eq 'ARRAY') {
        return $self->render(status => 400, json => { error => "Missing or invalid 'input_uuids' array in request body." });
    }

    my $output_block = $self->get_output_block($projectid);

    unless ($output_block && $output_block->{id}) {
        return $self->render(status => 404, json => { error => "Final output block not found for project $projectid" });
    }
    my $output_block_id = $output_block->{id};

    my %cache_dict; # Memoization cache for this request
    my @promises = map {
        my $input_uuid = $_;
        $self->get_result_of_block_id_p($output_block_id, $input_uuid, \%cache_dict)
            ->then(sub {
                my $result_uuid = shift;
                return { input_uuid => $input_uuid, output_uuid => $result_uuid, url => "/VIPS/preview/$result_uuid" };
            })
            ->catch(sub {
                my $err = shift;
                $self->app->log->error("Could not generate output for project $projectid with input $input_uuid: $err");
                return { input_uuid => $input_uuid, output_uuid => undef, error => "Pipeline execution failed for this input." };
            })
    } @$input_uuids;

    Mojo::Promise->all(@promises)->then(sub {
        my @outputs = map { $_->[0] } @_;
        $self->render(json => \@outputs);
    })->catch(sub {
        # This catch is for failures in Mojo::Promise->all itself, which is unlikely here.
        my $err = shift;
        $self->render(status => 500, json => { error => "An unexpected error occurred during batch processing: $err" });
    });
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

    my $out;
    if ($block->{gui_fields}) {
        eval { $out = decode_json($block->{output_value}); };
        $out = {} if $@ || ref $out ne 'HASH';
    } else {
        $out = {};
    }
    $out->{id} = $id;
    $self->render(json => [$out]);
};

put '/VIPS/settings/id/:key' => [key => qr/[a-z0-9\s\-_\.]+/i] => sub
{
    my $self = shift;
    my $id = $self->param('key');
    my $block = $self->pg->db->query(q{select output_value, gui_fields from blocks join blocks_catalogue on idblock = blocks_catalogue.id where blocks.id = ?}, $id)->hash;
    $block->{output_value} = '{}' unless $block->{output_value};
    my $out;
    eval { $out = decode_json($block->{output_value}); };
    $out = {} if $@ || ref $out ne 'HASH';
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

    if ($table eq 'projects') {
        # Add default input block
        $self->pg->db->insert('blocks', {
            idproject => $id,
            idblock => 17,
            originX => 100,
            originY => 100
        });

        # Add default output block
        $self->pg->db->insert('blocks', {
            idproject => $id,
            idblock => 109,
            originX => 400,
            originY => 100
        });
    }

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

del '/VIPS/input_images/:uuid' => [uuid => qr/[0-9a-f\-]+/i] => sub {
    my $self = shift;
    my $uuid = $self->param('uuid');

    # Find the image file path
    my $image_path = $self->find_image_path_by_uuid($uuid);

    # Delete the file from disk
    if ($image_path && -e $image_path) {
        if (!unlink $image_path) {
            $self->app->log->warn("Could not delete file $image_path: $!");
        }
    }

    # Delete from database
    my $res = $self->pg->db->delete('input_images', {uuid => $uuid});

    if ($res->rows) {
        return $self->render(status => 200, text => 'OK');
    } else {
        return $self->render(status => 404, text => 'Not Found');
    }
};
#
# end: generic DBI interface
#



# Asynchronous, promise-based version of the image processing helper
helper get_result_of_block_id_p => sub {
    my ($self, $id, $initial_input_uuid, $cache_dict) = @_;
    $cache_dict //= {};

    my $cache_key = "$id:$initial_input_uuid";
    return Mojo::Promise->resolve($cache_dict->{$cache_key}) if exists $cache_dict->{$cache_key};

    my $block_info = $self->pg->db->query(q{
                                                SELECT
                                                bc.name, bc.command, bc.parameter_template, bc.parameter_mappings, bc.gui_fields,
                                                b.connections, b.output_value, b.enabled
                                                FROM blocks b JOIN blocks_catalogue bc ON b.idblock = bc.id
                                                WHERE b.id = ?
                                            }, $id)->hash;

    my $conn = decode_json($block_info->{connections} || '{}');
    my $settings;
    eval { $settings = decode_json($block_info->{output_value} || '{}'); };
    $settings = {} if $@ || ref $settings ne 'HASH';
    $block_info->{parameter_mappings} = decode_json($block_info->{parameter_mappings} || '{}');

    if (defined $block_info->{enabled} && $block_info->{enabled} == 0) {
        my @input_keys = keys %$conn;
        return Mojo::Promise->resolve(undef) if @input_keys == 0;
        my $input_block_id = $conn->{(sort keys %$conn)[0]};
        return $self->get_result_of_block_id_p($input_block_id, $initial_input_uuid, $cache_dict)
        ->then(sub { $cache_dict->{$cache_key} = shift; });
    }

    if ($block_info->{name} eq 'Input') {
        return Mojo::Promise->resolve($initial_input_uuid)->then(sub { $cache_dict->{$cache_key} = shift; });
    }

    if ($block_info->{name} eq 'Load Image') {
        my $filename = $settings->{filename};
        my $res = $self->pg->db->query('SELECT uuid FROM input_images WHERE original_filename = ?', $filename)->hash;
        return Mojo::Promise->resolve($res->{uuid})->then(sub { $cache_dict->{$cache_key} = shift; });
    }

    if ($block_info->{name} eq 'Image Preview') {
        app->log->debug("Handling Image Preview block $id. Passing through input.");
        my @input_keys = keys %$conn;
        if (@input_keys != 1) {
            my $msg = "Image Preview block $id has " . scalar(@input_keys) . " inputs, but expected 1.";
            app->log->error($msg);
            return Mojo::Promise->reject($msg);
        }
        my $input_block_id = $conn->{$input_keys[0]};
        return $self->get_result_of_block_id_p($input_block_id, $initial_input_uuid, $cache_dict)
        ->then(sub { $cache_dict->{$cache_key} = shift; });
    }

    if ($block_info->{name} eq 'Exec Block') { # Special block for sub-project execution
        my $sub_project_name = $block_info->{output_value};
        unless ($sub_project_name) {
            return Mojo::Promise->reject("Sub-project block $id does not have a project name in auxfield.");
        }
        my $sub_project = $self->pg->db->query('SELECT id FROM projects WHERE name = ?', $sub_project_name)->hash;
        unless ($sub_project && $sub_project->{id}) {
            return Mojo::Promise->reject("Sub-project named '$sub_project_name' not found.");
        }
        my $sub_project_id = $sub_project->{id};
        my $output_block = $self->get_output_block($sub_project_id);
        unless ($output_block && $output_block->{id}) {
            return Mojo::Promise->reject("Final output block not found for sub-project '$sub_project_name'.");
        }
        my @input_keys = keys %$conn;
        if (@input_keys != 1) {
            return Mojo::Promise->reject("Sub-project block $id must have exactly one input.");
        }
        my $input_block_id = $conn->{$input_keys[0]};
        return $self->get_result_of_block_id_p($input_block_id, $initial_input_uuid, $cache_dict)
        ->then(sub {
            my $sub_project_input_uuid = shift;
            return $self->get_result_of_block_id_p($output_block->{id}, $sub_project_input_uuid, {});
        })->then(sub { $cache_dict->{$cache_key} = shift; });
    }

    my @input_promises = map { $self->get_result_of_block_id_p($conn->{$_}, $initial_input_uuid, $cache_dict) } sort keys %$conn;

    return Mojo::Promise->all(@input_promises)->then(sub {
        my @input_uuids = map { $_->[0] } @_;
        return Mojo::Promise->reject("Missing input UUID") if grep { !defined } @input_uuids;

        my $params_json = encode_json($settings);
        my $inputs_json = encode_json(\@input_uuids);

        my $cached = $self->pg->db->query('SELECT uuid FROM image_cache WHERE idblock = ? AND parameters_json = ? AND input_uuids_json = ?', $id, $params_json, $inputs_json)->hash;
        if ($cached) {
            my $cached_uuid = $cached->{uuid};
            my $cached_file = $self->find_image_path_by_uuid($cached_uuid);

            if ($cached_file && -e $cached_file) {
                app->log->debug("Cache HIT for block $id (file verified)");
                return Mojo::Promise->resolve($cached_uuid);
            }
            else {
                app->log->warn("STALE CACHE: Hit for block $id, but file for UUID '$cached_uuid' is missing. Deleting entry and reprocessing.");
                $self->pg->db->query('DELETE FROM image_cache WHERE uuid = ?', $cached_uuid);
            }
        }
        app->log->debug("Cache MISS for block $id");

        my $promise = Mojo::Promise->new;
        my $ug = Data::UUID->new;
        my $output_uuid = lc $ug->create_str();

        # ... (command assembly logic is unchanged) ...
        my %mapped_settings;
        for my $key (keys %$settings) {
            my $value = $settings->{$key};
            $mapped_settings{$key} = $block_info->{parameter_mappings}->{$key}->{$value} // $value;
        }
        my $param_template = $block_info->{parameter_template} || '';
        my @all_gui_fields = @{decode_json($block_info->{gui_fields} || '[]')};
        my @param_values;
        for my $key (@all_gui_fields) {
            push @param_values, $mapped_settings{$key};
        }
        my @positional_param_values;
        my @templated_args;

        if ($param_template) {
            my $num_template_params = () = $param_template =~ /%[sd]/g;
            my $num_total_params    = @param_values;
            my $num_positional_params = $num_total_params - $num_template_params;
            if ($num_positional_params < 0) { return $promise->reject("Configuration error for block $id") }
            if ($num_positional_params > 0) { @positional_param_values = @param_values[0 .. $num_positional_params - 1] }
            my @template_values = @param_values[$num_positional_params .. $#param_values];
            my $formatted_template_string = sprintf($param_template, @template_values);
            @templated_args = shellwords($formatted_template_string);
        } else {
            @positional_param_values = @param_values;
        }

        my @input_file_paths;
        for my $input_uuid (@input_uuids) {
            my $input_file = $self->find_image_path_by_uuid($input_uuid);
            unless ($input_file && -e $input_file) {
                return $promise->reject("Input file for UUID $input_uuid not found for block $id");
            }
            push @input_file_paths, $input_file->to_string;
        }

        my $final_output_path = $CACHED_IMAGE_DIR->child( $output_uuid . '.png');
        warn $final_output_path;
        return $promise->reject("Command not defined for block $id") unless $block_info->{command};

        my @command_parts = ($block_info->{command}, $block_info->{name}, @input_file_paths, $final_output_path->to_string, @positional_param_values, @templated_args);
        @command_parts = grep { defined && $_ ne '' } @command_parts;
        my $command_string = join ' ', map { my $arg = $_; $arg =~ s/'/'\\''/g; "'$arg'"; } @command_parts;
        $command_string .= ' 2>&1';
        app->log->debug("Executing shell command: sh -c \"$command_string\"");

        my $output_buffer = '';
        my $subprocess = Mojo::IOLoop->subprocess(
        sub {
            exec('sh', '-c', $command_string);
        },
        sub {
            my (undef, $err) = @_;

            if (-e $final_output_path && -s $final_output_path) {

                # 1. Attempt to insert the new cache entry using an UPSERT.
                # This will do nothing if the entry already exists, preventing the error.
                $self->pg->db->query(
                                        q{
                                            INSERT INTO image_cache (uuid, idblock, parameters_json, input_uuids_json)
                                            VALUES (?, ?, ?, ?)
                                            ON CONFLICT (idblock, parameters_json, input_uuids_json) DO NOTHING
                                        },
                                        $output_uuid, $id, $params_json, $inputs_json
                                    );

                # 2. Now, re-fetch the entry from the database. This guarantees we get the
                # correct UUID, whether it was the one we just inserted or one that another
                # worker inserted while we were busy.
                my $final_cache_entry = $self->pg->db->query(
                                                                'SELECT uuid FROM image_cache WHERE idblock = ? AND parameters_json = ? AND input_uuids_json = ?',
                                                                $id, $params_json, $inputs_json
                                                             )->hash;

                if ($final_cache_entry && $final_cache_entry->{uuid}) {
                    # If our generated UUID is different from the one in the DB, it means
                    # we lost the race. Clean up our own generated file.
                    if ($final_cache_entry->{uuid} ne $output_uuid) {
                        unlink $final_output_path->to_string if -e $final_output_path;
                    }
                    $promise->resolve($final_cache_entry->{uuid});
                } else {
                    # This should be a very rare case, but we handle it for safety.
                    $promise->reject("Failed to write or retrieve cache entry after processing.");
                }
            } else {
                app->log->error("Command execution failed for: $command_string");
                if ($err) { app->log->error("Subprocess reported an error argument: $err"); }
                else { app->log->error("Output file was not created or is empty after command execution."); }
                app->log->error("Combined Output (stdout/stderr): $output_buffer");
                unlink $final_output_path->to_string if -e $final_output_path;
                $promise->reject("Command execution failed");
            }
        }
        );
        $subprocess->on(stdout => sub { my (undef, $chunk) = @_; $output_buffer .= $chunk; });

        return $promise;
    })->then(sub {
        $cache_dict->{$cache_key} = $_[0];
        return $_[0];
    });
};

###################################################################
# main()

app->config(hypnotoad => {listen => ['http://*:3038'], workers => 3, heartbeat_timeout => 12000, inactivity_timeout => 12000});

app->start;
