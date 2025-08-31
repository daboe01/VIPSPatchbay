#!/usr/bin/env Rscript

#
# This script performs watershed-based segmentation to separate touching objects.
#
# The watershed algorithm is a powerful method for separating objects in an image
# that are close together. The standard workflow, which this script follows by
# default, is:
#   1. Start with a binary (black and white) image.
#   2. Compute the distance transform/map of the image. This creates a grayscale
#      "topography" where the center of each object is the highest peak.
#   3. Apply the watershed algorithm to this distance map to find the dividing
#      lines between the peaks, effectively separating the objects.
#
# Usage:
#   Rscript watershed_segment.R [options] INFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the input binary image with objects to be separated.
#   OUTFILE       Path to write the final segmented (labeled) image.
#
# Options:
#   -t, --tolerance <numeric>
#                 The minimum intensity height between an object's peak and where
#                 it touches another object. A larger value will cause more
#                 objects to be merged. [default: 1]
#
#   -e, --ext <integer>
#                 The radius of the neighborhood for detecting objects. A higher
#                 value can smooth out small, spurious segments. [default: 1]
#
#   --no-distmap
#                 Advanced: Disable the automatic distance map transformation.
#                 The watershed algorithm will be applied directly to the
#                 input image's intensity values.
#
# Example (a common use case):
#   Rscript watershed_segment.R -t 2 touching_objects.png separated_objects.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-t", "--tolerance"), type="double", default=1,
              help="Tolerance for merging objects. [default: %default]"),
  make_option(c("-e", "--ext"), type="integer", default=1,
              help="Radius of the neighborhood extension. [default: %default]"),
  make_option("--no-distmap", action="store_true", default=FALSE,
              help="Disable automatic distance map and use input as topography.")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Segments touching objects using the watershed algorithm."
)

parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# --- ROBUSTNESS FIX ---
# If the --no-distmap flag is not set, it should default to FALSE.
# This check handles cases where it might become NULL.
if (is.null(options$no_distmap)) {
  options$no_distmap <- FALSE
}


# --- Image Loading ---

cat("Reading image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(e) {
  stop("Error: Cannot read input file: ", e$message, call. = FALSE)
})

# --- Pre-processing & Topography Creation ---

# Ensure image is grayscale and 2D for processing
if (colorMode(img) == Color) { img <- channel(img, "gray") }
if (length(dim(img)) > 2) { img <- img[,,1] }

topography <- NULL

if (!options$no_distmap) {
  cat("Creating distance map from binary image...\n")
  # The input is assumed to be binary (non-zero pixels are foreground)
  binary_img <- img > 0
  # distmap creates the ideal "topography" for watershed
  topography <- distmap(binary_img)
} else {
  cat("Warning: Applying watershed directly to image intensities (--no-distmap).\n")
  # Use the input image directly as the topographic map
  topography <- img
}

# --- Watershed Segmentation ---

cat(sprintf("Running watershed with tolerance = %g and ext = %d...\n",
            options$tolerance, options$ext))

# The core of the script: call the watershed() function
# --- BUG FIX #2 ---
# Changed options.ext to options$ext
segmented_image <- watershed(
  x = topography,
  tolerance = options$tolerance,
  ext = options$ext
)

# --- Write Output ---

cat("Writing segmented image to:", outfile, "\n")

# The output of watershed() is a labeled image with integer values.
# To save it as a viewable image, we normalize it to the [0, 1] range.
# Each distinct object will appear as a different shade of gray.
final_image <- normalize(segmented_image)

tryCatch({
  writeImage(final_image, outfile)
}, error = function(e) {
  stop("Error: Cannot write output file: ", e$message, call. = FALSE)
})

cat("Done.\n")