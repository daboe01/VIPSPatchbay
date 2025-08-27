#!/usr/bin/env Rscript

#
# This script removes objects from a binary image based on their area.
#
# It performs the following steps:
# 1. Reads an input image.
# 2. Converts it to a binary image and identifies all connected objects (blobs).
# 3. Calculates the area (number of pixels) for every object.
# 4. Removes objects based on a user-provided size and mode (keep larger or smaller).
# 5. Writes the resulting cleaned-up binary image to a new file.
#
# Usage:
#   Rscript filter_objects_by_area.R [options] INFILE OUTFILE
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-s", "--minsize"), type="integer", default=50,
              help="The area in pixels to use as the threshold. [default: %default]"),
  make_option(c("-m", "--mode"), type="character", default="keep_larger",
              help="The filtering mode. One of: 'keep_larger', 'keep_smaller'. [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Removes objects based on a specified pixel area."
)

# Parse arguments, requiring two positional arguments
parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# Validate mode argument
valid_modes <- c("keep_larger", "keep_smaller")
if (!options$mode %in% valid_modes) {
  stop("Error: --mode must be one of 'keep_larger' or 'keep_smaller'.", call. = FALSE)
}

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
if (length(dim(img)) > 2) { img <- img[,,1] }

# --- Object Labeling and Feature Calculation ---
cat("Labeling objects and calculating area for each...\n")
labeled_img <- bwlabel(img)
features <- computeFeatures.shape(labeled_img)

# --- Filtering Logic ---
if (is.null(features) || nrow(features) == 0) {
  cat("No objects found in the image. Writing an empty image.\n")
  empty_img <- Image(0, dim=dim(img))
  writeImage(empty_img, outfile)
  cat("Done.\n")
  quit(save = "no", status = 0)
}

cat("Found", nrow(features), "objects. Filtering with mode '", options$mode, "' and threshold '", options$minsize, "'.\n")

# Determine which objects to remove based on the selected mode
objects_to_remove <- switch(
  options$mode,
  "keep_larger"  = which(features[,'s.area'] < options$minsize),
  "keep_smaller" = which(features[,'s.area'] >= options$minsize)
)

if (length(objects_to_remove) > 0) {
  cat("Removing", length(objects_to_remove), "objects.\n")
  filtered_labeled_img <- rmObjects(labeled_img, objects_to_remove)
} else {
  cat("No objects met the removal criteria.\n")
  filtered_labeled_img <- labeled_img
}

# --- Write Output ---
cat("Writing filtered image to:", outfile, "\n")
final_binary_image <- filtered_labeled_img > 0
tryCatch({
  writeImage(final_binary_image, outfile)
}, error = function(err) {
  stop(paste("Error: Cannot write output file:", outfile, "\n", err$message), call. = FALSE)
})

cat("Done.\n")