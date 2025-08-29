#!/usr/bin/env Rscript

#
# This script applies a median filter to an image to reduce noise.
#
# The median filter is a non-linear digital filtering technique, often used to
# remove "salt-and-pepper" noise from an image. It is an edge-preserving
# smoothing filter. For each pixel, it considers its neighbors, sorts their
# intensity values, and replaces the original pixel's value with the median value.
#
# Usage:
#   Rscript median_filter.R [options] INFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the input image (color or grayscale).
#   OUTFILE       Path to write the filtered output image.
#
# Options:
#   -r, --radius <integer>
#                 The radius of the square median filter kernel. The total
#                 kernel size will be (2 * radius + 1) x (2 * radius + 1).
#                 A larger radius has a stronger smoothing effect.
#                 [default: 3]
#
# Example (apply a 5x5 median filter):
#   Rscript median_filter.R --radius 2 noisy_image.png clean_image.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-r", "--radius"), type="integer", default=3,
              help="Radius of the filter kernel. Total size = (2*radius+1)x(2*radius+1). [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Applies a median filter to an image for noise reduction."
)

# Parse arguments, requiring two positional arguments
parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# --- Image Loading ---

cat("Reading image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})


# --- Median Filtering ---

kernel_size <- 2 * options$radius + 1
cat(sprintf("Applying a %dx%d median filter (radius = %d)...\n",
            kernel_size, kernel_size, options$radius))

# The core of the script: call the medianFilter() function.
# It automatically handles both grayscale and color images by applying
# the filter to each channel independently.
filtered_image <- medianFilter(
  x = img,
  size = options$radius
)


# --- Write Output ---

cat("Writing filtered image to:", outfile, "\n")
tryCatch({
  writeImage(filtered_image, outfile)
}, error = function(err) {
  stop(paste("Error: Cannot write output file:", outfile, "\n", err$message), call. = FALSE)
})

cat("Done.\n")