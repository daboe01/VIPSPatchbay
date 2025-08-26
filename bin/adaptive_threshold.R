#!/usr/bin/env Rscript

#
# This script performs adaptive thresholding on a grayscale image.
#
# Adaptive thresholding is a technique used to create a binary (black and white)
# image from a grayscale one, which is particularly effective for images with
# uneven illumination or gradients.
#
# It works by calculating a local threshold for each pixel based on the mean
# intensity of the pixels in its neighborhood.
#
# Usage:
#   Rscript adaptive_threshold.R [options] INFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the input image.
#   OUTFILE       Path to write the binarized output image.
#
# Options:
#   -w, --width <integer>
#                 The half-width of the moving window. The total window width
#                 will be (2 * width + 1). A larger window handles slower
#                 gradients but may miss local detail. [default: 10]
#
#   -H, --height <integer>
#                 The half-height of the moving window. The total window height
#                 will be (2 * height + 1). [default: 10]
#
#   -o, --offset <numeric>
#                 A constant subtracted from the local mean to calculate the
#                 final threshold. A small positive value makes it easier for
#                 pixels to become white, while a negative value makes it harder.
#                 It helps fine-tune the result. [default: 0.01]
#
# Example (using a larger 31x31 window):
#   Rscript adaptive_threshold.R -w 15 -H 15 -o 0.02 input.png output.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-w", "--width"), type="integer", default=10,
              help="Half-width of the moving window (total width = 2*w+1). [default: %default]"),
  # --- FIX IS HERE ---
  # Changed the short flag from "-h" to "-H" to avoid conflict with the default "--help" flag.
  make_option(c("-H", "--height"), type="integer", default=10,
              help="Half-height of the moving window (total height = 2*h+1). [default: %default]"),
  make_option(c("-o", "--offset"), type="double", default=0.01,
              help="Offset from the local mean to set the threshold. [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Performs adaptive thresholding on an image."
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

# Ensure image is grayscale for thresholding
if (colorMode(img) == Color) {
  cat("Converting input image to grayscale.\n")
  img <- channel(img, "gray")
}

# Ensure the image is a 2D matrix
if (length(dim(img)) > 2) {
  img <- img[,,1]
}

# --- Adaptive Thresholding ---

total_width <- 2 * options$width + 1
total_height <- 2 * options$height + 1
cat(sprintf("Applying adaptive threshold with a %dx%d window and an offset of %.3f...\n",
            total_width, total_height, options$offset))

# The core of the script: call the thresh() function from EBImage
# This function is a fast, built-in implementation of mean adaptive thresholding.
binary_image <- thresh(
  x = img,
  w = options$width,
  h = options$height,
  offset = options$offset
)


# --- Write Output ---

cat("Writing thresholded image to:", outfile, "\n")
tryCatch({
  writeImage(binary_image, outfile)
}, error = function(err) {
  stop(paste("Error: Cannot write output file:", outfile, "\n", err$message), call. = FALSE)
})

cat("Done.\n")