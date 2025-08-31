#!/usr/bin/env Rscript

#
# This script generates a Voronoi tesselation based on a seed image.
#
# It performs the following steps:
# 1. Reads a binary seed image containing objects or pixels that will act as the
#    'sites' for the Voronoi diagram.
# 2. It identifies each distinct site using connected components labeling.
# 3. It uses the EBImage::propagate function on a blank canvas with a very
#    high lambda value. This forces the algorithm to create regions based
#    purely on Euclidean distance from the seeds, resulting in a true
#    Voronoi tesselation.
# 4. The resulting diagram can be rendered as colored regions, as boundary
#    lines, or as a simple grayscale labeled image.
#
# Usage:
#   Rscript voronoi.R [options] SEED_IMAGE OUTFILE
#
# Arguments:
#   SEED_IMAGE    Path to the input black and white image containing the seeds.
#   OUTFILE       Path to write the final Voronoi diagram image.
#
# Options:
#   -c, --color
#                 Render the output with each Voronoi region in a different color.
#                 [default: FALSE]
#
#   -b, --boundaries
#                 Render the output as white boundary lines on a black background.
#                 This overrides the --color option. [default: FALSE]
#
# Example (colored regions):
#   Rscript voronoi.R --color seeds.png voronoi_colored.png
#
# Example (boundary lines):
#   Rscript voronoi.R --boundaries seeds.png voronoi_lines.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-c", "--color"), action="store_true", default=FALSE,
              help="Colorize the Voronoi regions."),
  make_option(c("-b", "--boundaries"), action="store_true", default=FALSE,
              help="Render only the boundaries of the regions.")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] SEED_IMAGE OUTFILE",
    description = "Generates a Voronoi tesselation from a seed image."
)

parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

seedfile <- args[1]
outfile <- args[2]

# --- Image Loading ---

cat("Reading seed image from:", seedfile, "\n")
tryCatch({
  seed_img <- readImage(seedfile)
}, error = function(e) {
  stop("Error: Cannot read seed file: ", e$message, call. = FALSE)
})

# --- Prepare for Propagation ---

# Ensure seed image is grayscale and 2D
if (colorMode(seed_img) == Color) { seed_img <- channel(seed_img, "gray") }
if (length(dim(seed_img)) > 2) { seed_img <- seed_img[,,1] }

cat("Labeling seeds...\n")
# Label each distinct object in the seed image with a unique integer ID
labeled_seeds <- bwlabel(seed_img)

if (max(labeled_seeds) == 0) {
  cat("No seeds found in the input image. Writing an empty image.\n")
  writeImage(Image(0, dim=dim(seed_img)), outfile)
  cat("Done.\n")
  quit(save = "no", status = 0)
}

# For a pure Voronoi diagram, the propagation should happen on a flat surface
# (a blank image with no gradients).
blank_canvas <- Image(0, dim = dim(seed_img))


# --- Generate Voronoi Diagram ---

cat("Generating Voronoi tesselation using propagate...\n")

# The core of the script: use propagate with a huge lambda.
# A high lambda forces the distance metric to be purely Euclidean,
# ignoring the (non-existent) gradients of the blank canvas.
voronoi_labels <- propagate(
  x = blank_canvas,
  seeds = labeled_seeds,
  lambda = 1e6 # A very large number to approximate infinity
)


# --- Render Output ---

cat("Rendering final image...\n")
final_image <- NULL

if (options$boundaries) {
  cat("Rendering boundaries...\n")
  # A trick to find boundaries is to see where a labeled image differs
  # from its eroded version. The difference is the pixel-wide boundary.
  brush <- makeBrush(3, shape = 'box')
  eroded_labels <- erode(voronoi_labels, brush)
  boundaries <- voronoi_labels != eroded_labels
  final_image <- Image(boundaries)
} else if (options$color) {
  cat("Rendering colored regions...\n")
  # Use colorLabels to assign a random, distinct color to each region
  final_image <- colorLabels(voronoi_labels)
} else {
  cat("Rendering labeled grayscale image...\n")
  # Default output is a normalized grayscale image where each
  # region has a unique intensity.
  final_image <- normalize(voronoi_labels)
}


# --- Write Output ---

cat("Writing image to:", outfile, "\n")
tryCatch({
  writeImage(final_image, outfile)
}, error = function(e) {
  stop("Error: Cannot write output file: ", e$message, call. = FALSE)
})

cat("Done.\n")