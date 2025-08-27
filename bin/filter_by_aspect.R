#!/usr/bin/env Rscript

#
# This script filters binary objects based on their aspect ratio (width / height).
#
# It performs the following steps:
# 1. Reads a binary input image and identifies all connected objects (blobs).
# 2. For each object, it calculates the dimensions of its bounding box (min/max x and y).
# 3. It computes the aspect ratio for each object using the formula: width / height.
# 4. It removes objects based on a user-provided threshold and comparison operator.
# 5. Writes the resulting filtered binary image to a new file.
#
# Usage:
#   Rscript filter_by_aspect_ratio.R [options] INFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the input black and white image.
#   OUTFILE       Path to write the filtered output image.
#
# Options:
#   -t, --threshold <numeric>
#                 The aspect ratio value to compare against. [default: 1.5]
#
#   -o, --operator <name>
#                 The comparison operator. Must be one of:
#                 'gt'  - Keep objects with aspect ratio > threshold (wider)
#                 'lt'  - Keep objects with aspect ratio < threshold (taller)
#                 'gte' - Keep objects with aspect ratio >= threshold
#                 'lte' - Keep objects with aspect ratio <= threshold
#                 [default: 'gt']
#
# Example (keep only objects that are at least twice as wide as they are tall):
#   Rscript filter_by_aspect_ratio.R -t 2.0 -o gt input.png wide_objects.png
#
# Example (keep only objects that are taller than they are wide):
#   Rscript filter_by_aspect_ratio.R -t 1.0 -o lt input.png tall_objects.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-t", "--threshold"), type="double", default=1.5,
              help="The aspect ratio value to compare against. [default: %default]"),
  make_option(c("-o", "--operator"), type="character", default="gt",
              help="Operator: 'gt', 'lt', 'gte', or 'lte'. [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Filters binary objects by their aspect ratio (width/height)."
)

parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# --- Validate Arguments ---

if (options$threshold <= 0) {
  stop("Error: Threshold must be a positive number.", call. = FALSE)
}

valid_operators <- c("gt", "lt", "gte", "lte")
if (!options$operator %in% valid_operators) {
  stop("Error: Operator must be one of 'gt', 'lt', 'gte', or 'lte'.", call. = FALSE)
}


# --- Image Processing ---

cat("Reading image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})

# Ensure image is grayscale and 2D
if (colorMode(img) == Color) { img <- channel(img, "gray") }
if (length(dim(img)) > 2) { img <- img[,,1] }

# Label connected components
labeled_img <- bwlabel(img)
num_objects <- max(labeled_img)

if (num_objects == 0) {
  cat("No objects found in the image. Writing an empty image.\n")
  writeImage(Image(0, dim=dim(img)), outfile)
  cat("Done.\n")
  quit(save = "no", status = 0)
}

cat("Found", num_objects, "objects. Calculating aspect ratios...\n")

# --- Calculate Aspect Ratio for Each Object ---

aspect_ratios <- numeric(num_objects)

for (i in 1:num_objects) {
  # Get the (row, col) coordinates of all pixels for the current object
  object_coords <- which(labeled_img == i, arr.ind = TRUE)
  
  # R returns (row, col), which corresponds to (y, x)
  y_coords <- object_coords[, 1]
  x_coords <- object_coords[, 2]
  
  # Calculate bounding box dimensions. Add 1 for inclusivity.
  height <- max(y_coords) - min(y_coords) + 1
  width <- max(x_coords) - min(x_coords) + 1
  
  # Calculate aspect ratio, avoiding division by zero
  if (height > 0) {
    aspect_ratios[i] <- width / height
  } else {
    aspect_ratios[i] <- 0 # Should not happen with height > 0 check
  }
}


# --- Filtering Logic ---

cat(sprintf("Filtering objects where aspect ratio is NOT %s %.2f...\n", options$operator, options$threshold))

# Determine which objects to REMOVE based on the inverted condition
objects_to_remove <- switch(
  options$operator,
  "gt"  = which(aspect_ratios <= options$threshold),
  "lt"  = which(aspect_ratios >= options$threshold),
  "gte" = which(aspect_ratios < options$threshold),
  "lte" = which(aspect_ratios > options$threshold)
)

if (length(objects_to_remove) > 0) {
  cat("Removing", length(objects_to_remove), "objects that do not meet the criteria.\n")
  filtered_labeled_img <- rmObjects(labeled_img, objects_to_remove)
} else {
  cat("No objects met the removal criteria.\n")
  filtered_labeled_img <- labeled_img
}


# --- Write Output ---

cat("Writing filtered image to:", outfile, "\n")

# Convert the final labeled image back to a simple binary (0 or 1) image
final_binary_image <- filtered_labeled_img > 0

tryCatch({
  writeImage(final_binary_image, outfile)
}, error = function(err) {
  stop(paste("Error: Cannot write output file:", outfile, "\n", err$message), call. = FALSE)
})

cat("Done.\n")