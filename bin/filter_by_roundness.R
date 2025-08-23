#!/usr/bin/env Rscript

#
# This script filters objects in a binary image based on their roundness.
#
# It performs the following steps:
# 1. Reads a binary input image containing objects (blobs).
# 2. Identifies all connected objects and calculates their shape features (area and perimeter).
# 3. Calculates a roundness metric for each object using the formula:
#    (4 * pi * area) / (perimeter^2)
#    A value of 1.0 is a perfect circle; values closer to 0 are less round.
# 4. Removes objects based on the user-provided threshold and operator.
# 5. Writes the resulting filtered binary image to a new file.
#
# Usage:
#   Rscript filter_by_roundness.R <INFILE> <OUTFILE> <THRESHOLD> <OPERATOR>
#
# Arguments:
#   <INFILE>     Path to the input black and white image.
#   <OUTFILE>    Path to write the filtered output image.
#   <THRESHOLD>  A number between 0.0 and 1.0 to compare against.
#   <OPERATOR>   One of the following:
#                  'gt'  - Keep objects with roundness > THRESHOLD
#                  'lt'  - Keep objects with roundness < THRESHOLD
#                  'gte' - Keep objects with roundness >= THRESHOLD
#                  'lte' - Keep objects with roundness <= THRESHOLD
#
# Example (keep only very round objects):
#   Rscript filter_by_roundness.R input.png output.png 0.8 gt
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))

# --- Argument Handling ---

args <- commandArgs(trailingOnly = TRUE)

if (length(args) != 4) {
  stop("Usage: Rscript filter_by_roundness.R <INFILE> <OUTFILE> <THRESHOLD> <OPERATOR>\n       (OPERATOR must be one of: gt, lt, gte, lte)", call. = FALSE)
}

infile <- args[1]
outfile <- args[2]
threshold <- as.numeric(args[3])
operator <- tolower(args[4])

# Validate arguments
if (is.na(threshold) || threshold < 0 || threshold > 1) {
  stop("Error: THRESHOLD must be a number between 0.0 and 1.0.", call. = FALSE)
}

valid_operators <- c("gt", "lt", "gte", "lte")
if (!operator %in% valid_operators) {
  stop("Error: OPERATOR must be one of 'gt', 'lt', 'gte', or 'lte'.", call. = FALSE)
}

# --- Image Processing ---

cat("Reading image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})

# Ensure image is grayscale for labeling
if (colorMode(img) == Color) {
  img <- channel(img, "gray")
}

cat("Labeling objects and calculating shape features...\n")
# Label connected components in the binary image
img_labels <- bwlabel(img)

# Compute shape features for each labeled object
features <- computeFeatures.shape(img_labels)

# --- Filtering Logic ---

if (is.null(features) || nrow(features) == 0) {
  cat("No objects found in the image. Writing an empty image.\n")
  empty_img <- Image(0, dim=dim(img))
  writeImage(empty_img, outfile)
} else {
  cat("Found", nrow(features), "objects. Filtering by roundness.\n")

  # Calculate roundness for each object
  # Avoid division by zero for objects with no perimeter (single pixels)
  perimeter <- features[,'s.perimeter']
  area <- features[,'s.area']
  roundness <- numeric(length(area))
  
  # Calculate only where perimeter is not zero
  valid_indices <- which(perimeter > 0)
  roundness[valid_indices] <- (4 * pi * area[valid_indices]) / (perimeter[valid_indices]^2)

  # Determine which objects to remove based on the operator
  # The logic is inverted: we find the indices of objects that DON'T meet the criteria.
  to_remove <- switch(operator,
    "gt"  = which(roundness <= threshold),
    "lt"  = which(roundness >= threshold),
    "gte" = which(roundness < threshold),
    "lte" = which(roundness > threshold)
  )

  if (length(to_remove) > 0) {
    cat("Removing", length(to_remove), "objects that do not meet the criteria.\n")
    img_filtered <- rmObjects(img_labels, to_remove)
  } else {
    cat("No objects met the removal criteria.\n")
    img_filtered <- img_labels
  }

  cat("Writing filtered image to:", outfile, "\n")
  # Convert the final labeled image back to a binary (0 or 1) image
  writeImage(img_filtered > 0, outfile)
}

cat("Done.\n")