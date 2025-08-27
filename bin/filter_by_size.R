#!/usr/bin/env Rscript

#
# This script removes small objects (noise) from a binary image based on their area.
#
# It performs the following steps:
# 1. Reads an input image.
# 2. Converts it to a binary image and identifies all connected objects (blobs).
# 3. Calculates the area (number of pixels) for every object.
# 4. Removes any object with an area smaller than the user-provided minimum size.
# 5. Writes the resulting cleaned-up binary image to a new file.
#
# Usage:
#   Rscript filter_small_objects.R [options] INFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the input black and white image.
#   OUTFILE       Path to write the filtered output image.
#
# Options:
#   -s, --minsize <integer>
#                 The minimum area (in pixels) for an object to be kept.
#                 Any object smaller than this will be removed.
#                 [default: 50]
#
# Example (remove all objects with fewer than 100 pixels):
#   Rscript filter_small_objects.R --minsize 100 noisy_input.png clean_output.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-s", "--minsize"), type="integer", default=50,
              help="The minimum area in pixels for an object to be kept. [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Removes all objects smaller than a specified pixel area."
)

# Parse arguments, requiring two positional arguments
parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# --- Image Loading and Pre-processing ---

cat("Reading image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})

# Ensure image is grayscale for labeling
if (colorMode(img) == Color) {
  cat("Converting input image to grayscale.\n")
  img <- channel(img, "gray")
}

# Ensure the image is a 2D matrix
if (length(dim(img)) > 2) {
  img <- img[,,1]
}

# --- Object Labeling and Feature Calculation ---

cat("Labeling objects and calculating area for each...\n")

# Label connected components in the binary image.
# bwlabel treats any non-zero pixel as part of an object.
labeled_img <- bwlabel(img)

# Compute shape features, primarily to get the area ('s.area')
features <- computeFeatures.shape(labeled_img)


# --- Filtering Logic ---

if (is.null(features) || nrow(features) == 0) {
  cat("No objects found in the image. Writing an empty image.\n")
  # Create and write an empty (black) image with the same dimensions
  empty_img <- Image(0, dim=dim(img))
  writeImage(empty_img, outfile)
  cat("Done.\n")
  quit(save = "no", status = 0)
}

cat("Found", nrow(features), "objects. Filtering those smaller than", options$minsize, "pixels.\n")

# Identify the indices (which are the object labels) of the objects to remove.
# These are the objects where the area is less than the minimum size.
objects_to_remove <- which(features[,'s.area'] < options$minsize)

if (length(objects_to_remove) > 0) {
  cat("Removing", length(objects_to_remove), "small objects.\n")
  # Use rmObjects to remove the selected objects from the labeled image
  filtered_labeled_img <- rmObjects(labeled_img, objects_to_remove)
} else {
  cat("No objects were smaller than the specified minimum size. No objects removed.\n")
  filtered_labeled_img <- labeled_img
}


# --- Write Output ---

cat("Writing filtered image to:", outfile, "\n")

# Convert the final labeled image back to a simple binary (0 or 1) image
# Any pixel with a label > 0 becomes 1 (white), otherwise 0 (black).
final_binary_image <- filtered_labeled_img > 0

tryCatch({
  writeImage(final_binary_image, outfile)
}, error = function(err) {
  stop(paste("Error: Cannot write output file:", outfile, "\n", err$message), call. = FALSE)
})

cat("Done.\n")