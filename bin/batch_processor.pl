#!/usr/bin/env perl

use strict;
use warnings;
use Getopt::Long qw(GetOptions);
use Mojo::UserAgent;
use Mojo::File qw(path);
use Pod::Usage qw(pod2usage);

# --- Configuration ---
my $SERVER_URL_BASE = 'http://localhost:3000';
# --- End Configuration ---

# --- Command-line argument parsing ---
my $input_dir_str;
my $output_dir_str;
my $project_id;
my $help = 0;

GetOptions(
    'input-dir|i=s'  => \$input_dir_str,
    'output-dir|o=s' => \$output_dir_str,
    'project-id|p=i' => \$project_id,
    'help|h'         => \$help,
) or pod2usage(2);

pod2usage(1) if $help;

# --- Validation ---
unless ($input_dir_str && $project_id) {
    print STDERR "Error: --input-dir and --project-id are required.\n\n";
    pod2usage(2);
}

my $input_dir = path($input_dir_str);
unless ($input_dir->is_dir) {
    die "Error: Input directory '$input_dir' does not exist or is not a directory.\n";
}

# If no output directory is specified, use the input directory.
my $output_dir = $output_dir_str ? path($output_dir_str) : $input_dir;

# Create the output directory if it doesn't exist.
$output_dir->make_path unless $output_dir->is_dir;
print "Results will be saved in: $output_dir\n";


# --- Main Logic ---
my $ua = Mojo::UserAgent->new;
$ua->connect_timeout(10);
$ua->inactivity_timeout(300); # 5 minutes for slow processing.

# Find all common image files in the directory (case-insensitive).
my @image_files = $input_dir->list({dir => 0})->grep(qr/\.(jpe?g|png|tiff?)$/i)->each;

if (!@image_files) {
    print "No image files found in '$input_dir'.\n";
    exit 0;
}

print "Found " . scalar(@image_files) . " images to process.\n";

for my $input_file (@image_files) {
    my $filename = $input_file->basename;
    print "Processing '$filename'... ";

    # 1. Construct the target URL.
    my $url = Mojo::URL->new($SERVER_URL_BASE)->path("/vips/process_image_statelessly/$project_id");

    # 2. Send the POST request using Mojo::UserAgent.
    # The 'image' key must match the one expected by the Mojolicious route.
    my $tx = $ua->post($url => form => {
        image => {file => $input_file->to_string}
    });

    my $res = $tx->result;

    # 3. Handle the response.
    if ($res->is_success) {
        # Construct the new filename.
        # The stateless route always returns a PNG.
        my $output_filename = $input_file->basename('.*') . '_mask.png';
        my $output_file = $output_dir->child($output_filename);

        # Save the returned image data to the new file using Mojo::File's spurt.
        $output_file->spurt($res->body);

        print "OK -> $output_filename\n";
    }
    else {
        print "FAILED!\n";
        warn "  Error processing '$filename':\n";
        warn "  Status: " . $res->code . " " . $res->message . "\n";
        # Try to show the error message from the server if it's not too long.
        my $error_content = $res->body;
        if ($error_content && length($error_content) < 300) {
           warn "  Response: $error_content\n";
        }
    }
}

print "Processing complete.\n";

__END__

=head1 NAME

process_directory_mojo.pl - Process a directory of images using the PatchbayVIPS stateless API with Mojo tools.

=head1 SYNOPSIS

process_directory_mojo.pl --input-dir /path/to/images --project-id 123 [--output-dir /path/to/results]

=head1 DESCRIPTION

This script finds all common image files (JPG, PNG, TIFF) in a specified input
directory, sends each one to the PatchbayVIPS stateless processing endpoint using
Mojo::UserAgent, and saves the resulting image to an output directory.

The resulting images will have the same base name as their input file, but with
a "_mask.png" suffix, as the server always returns a PNG image.

=head1 ARGUMENTS

=over 4

=item B<--input-dir>, B<-i> (required)

The path to the directory containing the images you want to process.

=item B<--project-id>, B<-p> (required)

The database ID of the PatchbayVIPS project pipeline to use for processing.

=item B<--output-dir>, B<-o> (optional)

The path to the directory where the resulting mask images will be saved.
If not provided, the results will be saved in the B<--input-dir>.

=item B<--help>, B<-h>

Displays this help message.

=back

=head1 PREREQUISITES

You must have the B<Mojolicious> toolkit installed. If you have the backend server
for this project, you already have it.

You can install it by running: C<cpan install Mojolicious>

=cut
