#!/usr/bin/env Rscript

#
# This script performs connected components labeling on a binary image.
#
# It identifies all distinct groups of touching foreground pixels (objects or blobs)
# and assigns a unique integer ID (a label) to each one. This is a fundamental
# step for any kind of object-based image analysis.
#
# Usage:
#   Rscript bwlabel.R [options] INFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the input binary (black and white) image.
#   OUTFILE       Path to write the final labeled image.
#
# Options:
#   -c, --color
#                 Color-code the output labels for better visualization. If not
#                 set, the output will be a grayscale image where each object
#                 has a unique intensity. [default: FALSE]
#
# Example (grayscale output):
#   Rscript bwlabel.R binary_image.png labeled_image.png
#
# Example (colorized output):
#   Rscript bwlabel.R --color binary_image.png labeled_color.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-c", "--color"), action="store_true", default=FALSE,
              help="Color-code the output labels for better visualization.")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Performs connected components labeling on a binary image."
)

parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# --- Image Loading ---

cat("Reading image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(e) {
  stop("Error: Cannot read input file: ", e$message, call. = FALSE)
})


# --- Pre-processing ---

# Ensure image is grayscale and 2D for labeling
if (colorMode(img) == Color) { img <- channel(img, "gray") }
if (length(dim(img)) > 2) { img <- img[,,1] }

# --- Connected Components Labeling ---

cat("Performing connected components labeling...\n")

# The core of the script: call the bwlabel() function.
# It treats any non-zero pixel as belonging to the foreground.
labeled_image <- bwlabel(img)

num_objects <- max(labeled_image)
cat("Found", num_objects, "distinct objects.\n")


# --- Render and Write Output ---

if (num_objects == 0) {
  cat("No objects found. Writing an empty image.\n")
  final_image <- Image(0, dim=dim(img))
} else {
  final_image <- NULL
  if (options$color) {
    cat("Rendering colored labels...\n")
    # colorLabels assigns a unique, random color to each integer label.
    final_image <- colorLabels(labeled_image)
  } else {
    cat("Rendering grayscale labels...\n")
    # Normalize the integer labels to the [0, 1] range to create a
    # viewable grayscale image.
    final_image <- (labeled_image)
  }
}

cat("Writing labeled image to:", outfile, "\n")
tryCatch({
  writeImage(final_image, outfile)
}, error = function(e) {
  stop("Error: Cannot write output file: ", e$message, call. = FALSE)
})

cat("Done.\n")