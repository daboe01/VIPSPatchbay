#!/usr/bin/env Rscript

#
# This script performs image segmentation using the 'propagate' method.
#
# This is a powerful Voronoi-based segmentation technique that finds boundaries
# between pre-identified 'seeds'. The boundaries are guided by the intensity
# landscape of the main image, making it ideal for tasks like separating
# clustered cells where the cell borders are visible.
#
# Usage:
#   Rscript propagate_segment.R [options] INFILE SEEDFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the grayscale image to be segmented. The algorithm
#                 uses the intensity gradients in this image to find boundaries.
#   SEEDFILE      Path to a labeled image where each unique integer value
#                 represents a seed from which a region will grow.
#   OUTFILE       Path to write the final segmented (labeled) image.
#
# Options:
#   -m, --mask <file>
#                 Optional path to a binary mask image. Segmentation will be
#                 restricted to the white areas of this mask.
#
#   -l, --lambda <numeric>
#                 The regularization parameter. A small lambda (e.g., 1e-4)
#                 makes boundaries follow image gradients strongly. A large
#                 lambda makes them straight Euclidean-distance boundaries.
#                 [default: 1e-4]
#
# Example:
#   Rscript propagate_segment.R -l 0.01 cells.tif nuclei_labels.tif segmented_cells.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-m", "--mask"), type="character", default=NULL,
              help="Optional binary mask file to restrict segmentation."),
  make_option(c("-l", "--lambda"), type="double", default=1e-4,
              help="Regularization parameter lambda. [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE SEEDFILE OUTFILE",
    description = "Segments an image by propagating regions from seeds."
)

parsed_args <- parse_args(parser, positional_arguments = 3)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
seedfile <- args[2]
outfile <- args[3]

# --- Image Loading and Validation ---

cat("Reading main image from:", infile, "\n")
tryCatch({ main_img <- readImage(infile) }, error = function(e) stop("Cannot read main image: ", e$message))

cat("Reading seed image from:", seedfile, "\n")
tryCatch({ seed_img <- readImage(seedfile) }, error = function(e) stop("Cannot read seed image: ", e$message))

# Load mask if provided
mask_img <- NULL
if (!is.null(options$mask)) {
  cat("Reading mask image from:", options$mask, "\n")
  tryCatch({ mask_img <- readImage(options$mask) }, error = function(e) stop("Cannot read mask image: ", e$message))
}

# --- Pre-processing ---

# Ensure main image is grayscale and 2D
if (colorMode(main_img) == Color) { main_img <- channel(main_img, "gray") }
if (length(dim(main_img)) > 2) { main_img <- main_img[,,1] }

# Ensure seed image is grayscale and 2D
if (colorMode(seed_img) == Color) { seed_img <- channel(seed_img, "gray") }
if (length(dim(seed_img)) > 2) { seed_img <- seed_img[,,1] }

# Ensure images have the same dimensions
if (!all(dim(main_img) == dim(seed_img))) {
  stop("Error: Main image and seed image must have the same dimensions.")
}

if (!is.null(mask_img)) {
  if (colorMode(mask_img) == Color) { mask_img <- channel(mask_img, "gray") }
  if (length(dim(mask_img)) > 2) { mask_img <- mask_img[,,1] }
  if (!all(dim(main_img) == dim(mask_img))) {
    stop("Error: Mask image must have the same dimensions as the main image.")
  }
}

# --- Propagation ---

cat(sprintf("Running propagate with lambda = %g...\n", options$lambda))

# The core of the script: call the propagate() function
segmented_image <- propagate(
  x = main_img,
  seeds = seed_img,
  mask = mask_img,
  lambda = options$lambda
)

# --- Write Output ---

cat("Writing segmented image to:", outfile, "\n")

# Normalize the resulting labeled image so it can be viewed as a grayscale image
# where each region has a different intensity.
final_image <- normalize(segmented_image)

tryCatch({
  writeImage(final_image, outfile)
}, error = function(e) {
  stop("Error: Cannot write output file: ", e$message)
})

cat("Done.\n")