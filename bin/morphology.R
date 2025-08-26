#!/usr/bin/env Rscript

#
# This script performs various grayscale morphological operations on an image.
#
# It provides a command-line interface to the core morphology functions
# in the EBImage package, allowing for dilation, erosion, opening, closing,
# and top-hat transformations.
#
# Usage:
#   Rscript morphology.R --operation <name> [options] INFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the input image.
#   OUTFILE       Path to write the processed output image.
#
# Required Option:
#   -o, --operation <name>
#                 The morphological operation to perform. Must be one of:
#                 'dilate', 'erode', 'open', 'close', 'whiteTopHat', 'blackTopHat'
#
# Options for the Structuring Element (Brush):
#   -s, --size <integer>
#                 The size of the brush in pixels. Should be an odd number.
#                 [default: 5]
#
#   -p, --shape <shape>
#                 The shape of the brush. Must be one of:
#                 'box', 'disc', 'diamond', 'Gaussian', 'line'
#                 [default: 'disc']
#
# Examples:
#   # Erode an image with a 7x7 box to shrink features
#   Rscript morphology.R -o erode -s 7 -p box input.png eroded_output.png
#
#   # Perform a white-tophat transform to find small, bright spots
#   Rscript morphology.R --operation whiteTopHat --size 21 input.png tophat_output.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-o", "--operation"), type="character",
              help="Required. The morphological operation to perform. One of: 'dilate', 'erode', 'open', 'close', 'whiteTopHat', 'blackTopHat'."),
  make_option(c("-s", "--size"), type="integer", default=5,
              help="The size of the brush in pixels (should be odd). [default: %default]"),
  make_option(c("-p", "--shape"), type="character", default="disc",
              help="The shape of the brush. One of: 'box', 'disc', 'diamond', 'Gaussian', 'line'. [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog --operation <name> [options] INFILE OUTFILE",
    description = "A command-line wrapper for grayscale morphology operations."
)

# Parse arguments
parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# --- Validate Arguments ---

# Check for required operation
if (is.null(options$operation)) {
  print_help(parser)
  stop("Error: The --operation option is required.", call. = FALSE)
}

# Validate operation name
valid_ops <- c("dilate", "erode", "open", "close", "whiteTopHat", "blackTopHat")
if (!options$operation %in% valid_ops) {
  stop(paste("Error: Invalid operation '", options$operation, "'. Must be one of: ", paste(valid_ops, collapse=", ")), call. = FALSE)
}

# Validate shape name
valid_shapes <- c('box', 'disc', 'diamond', 'Gaussian', 'line')
if (!options$shape %in% valid_shapes) {
  stop(paste("Error: Invalid shape '", options$shape, "'. Must be one of: ", paste(valid_shapes, collapse=", ")), call. = FALSE)
}

# Adjust brush size to be odd if necessary
if (options$size %% 2 == 0) {
  options$size <- options$size + 1
  cat(sprintf("Warning: Brush size must be odd. Adjusting to %d.\n", options$size))
}


# --- Image Processing ---

cat("Reading image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})

# Ensure image is grayscale for morphology
if (colorMode(img) == Color) {
  cat("Converting input image to grayscale.\n")
  img <- channel(img, "gray")
}
if (length(dim(img)) > 2) {
  img <- img[,,1]
}

cat(sprintf("Performing '%s' operation with a '%s' brush of size %d...\n",
            options$operation, options$shape, options$size))

# Create the structuring element (brush)
brush <- makeBrush(size = options$size, shape = options$shape)

# Perform the selected morphological operation using a switch statement
processed_image <- switch(
  options$operation,
  "dilate"      = dilate(img, brush),
  "erode"       = erode(img, brush),
  "open"        = opening(img, brush),
  "close"       = closing(img, brush),
  "whiteTopHat" = whiteTopHat(img, brush),
  "blackTopHat" = blackTopHat(img, brush),
  stop("Internal error: Operation not caught by switch.") # Should not be reached
)

# Normalize the result to the [0, 1] range for proper saving
# This is especially important for top-hat results
final_image <- normalize(processed_image)

cat("Writing processed image to:", outfile, "\n")
tryCatch({
  writeImage(final_image, outfile)
}, error = function(err) {
  stop(paste("Error: Cannot write output file:", outfile, "\n", err$message), call. = FALSE)
})

cat("Done.\n")