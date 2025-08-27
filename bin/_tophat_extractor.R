#!/usr/bin/env Rscript

#
# This script performs an advanced image processing pipeline to isolate and
# clean up bright objects in an image.
#
# Pipeline Steps:
# 1. Apply a White Top-Hat filter to enhance bright features.
# 2. Use adaptive thresholding to create a binary (black & white) image.
# 3. Label all distinct objects found in the binary image.
# 4. Remove any objects smaller than a specified pixel area.
# 5. Write the final, cleaned-up image to an output file.
#
# This is useful for tasks like cell counting, particle detection, or text extraction
# where you need to isolate features and remove background noise.
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Command-Line Option Definitions ---

option_list <- list(
    make_option(c("-s", "--size"), type="integer", default=15,
                help="Size of the brush for filtering and thresholding window (odd integer recommended) [default: %default]"),
    make_option(c("-b", "--brush"), type="character", default="disc",
                help="Shape of the brush: 'disc', 'box', 'diamond', or 'line' [default: %default]"),
    make_option(c("-o", "--offset"), type="double", default=0.05,
                help="Offset for adaptive thresholding; a small positive value makes the threshold stricter [default: %default]"),
    make_option(c("-a", "--min-area"), type="integer", default=50,
                help="Minimum pixel area for an object to be kept; smaller objects are removed [default: %default]")
)

# --- Argument Parser ---

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "A script to enhance, binarize, and filter objects in an image."
)

# Parse arguments, requiring two positional arguments (INFILE, OUTFILE)
parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

# Assign positional arguments to variables
infile <- args[1]
outfile <- args[2]

# --- Image Processing Pipeline ---

cat("--> Reading image from:", infile, "\n")

# Use a tryCatch block for robust file reading
tryCatch({
  e <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})

# Ensure the image is grayscale for processing
if (colorMode(e) != Grayscale) {
  cat("--> Image is color, converting to grayscale.\n")
  e <- channel(e, "gray")
}

cat(sprintf("--> 1. Applying White Top-Hat filter (brush: %s, size: %d)...\n", options$brush, options$size))
# The original snippet used a non-standard function 'whiteTopHatGreyScale'.
# The standard EBImage function is 'whiteTopHat', which works on grayscale images.
brush <- makeBrush(size = options$size, shape = options$brush)
e.1 <- whiteTopHat(e, brush)


cat(sprintf("--> 2. Applying adaptive threshold (window size: %d, offset: %.2f)...\n", options$size, options$offset))
# Adaptive thresholding converts the image to binary (black/white)
# It's great for images with uneven lighting.
e.bw <- thresh(e.1, w = options$size, h = options$size, offset = options$offset)


cat("--> 3. Labeling connected objects...\n")
# bwlabel finds and assigns a unique integer ID to each distinct white object
e.lab <- bwlabel(e.bw)


cat(sprintf("--> 4. Filtering objects smaller than %d pixels...\n", options$'min-area'))
# Compute shape features for all labeled objects
features <- computeFeatures.shape(e.lab)

# Check if any objects were found before trying to filter them
if (is.null(features) || nrow(features) == 0) {
  cat("--> No objects found after thresholding. Writing an empty image.\n")
  # Create an empty image with the same dimensions as the original
  e.lab.1 <- Image(0, dim=dim(e))
} else {
  # Identify the indices of objects whose area is smaller than the minimum area
  irm <- which(features[, 's.area'] < options$'min-area')
  num_removed <- length(irm)
  num_total <- nrow(features)
  cat(sprintf("    Found %d total objects, removing %d small objects.\n", num_total, num_removed))

  # Remove the identified small objects
  e.lab.1 <- rmObjects(e.lab, irm)
}


cat("--> 5. Writing final image to:", outfile, "\n")
# Write the processed image. `normalize` scales pixel values to be visible.
writeImage(normalize(e.lab.1), outfile)

cat("--> Done.\n")