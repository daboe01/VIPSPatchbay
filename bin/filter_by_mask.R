#!/usr/bin/env Rscript

#
# This script filters objects in a binary image based on a mask.
#
# It performs the following steps:
# 1. Reads a binary input image containing objects (blobs).
# 2. Reads a mask image containing black dots that mark desired object locations.
# 3. Verifies that both images have the same dimensions.
# 4. Identifies all connected objects in the input image and calculates their centroids.
# 5. Checks which object centroids from the input image fall on the black dots of the mask.
# 6. Removes any object that is not marked by a dot in the mask.
# 7. Writes the resulting filtered binary image to a new file.
#
# The mask's black dots should align with the centroids of the blobs to be kept.
#
# Usage: Rscript filter_by_mask.R <INFILE> <MASKFILE> <OUTFILE>
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))

# --- Argument Handling ---

# Get command-line arguments provided after the script name
args <- commandArgs(trailingOnly = TRUE)

# Check if exactly three arguments are provided
if (length(args) != 3) {
  # Print a helpful usage message and exit if arguments are incorrect
  stop("Usage: Rscript filter_by_mask.R <INFILE> <MASKFILE> <OUTFILE>", call. = FALSE)
}

# Assign the positional arguments to variables
infile <- args[1]
maskfile <- args[2]
outfile <- args[3]


# --- Image Processing ---

cat("Reading input image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})

cat("Reading mask image from:", maskfile, "\n")
tryCatch({
  mask <- readImage(maskfile)
}, error = function(err) {
  stop(paste("Error: Cannot read mask file:", maskfile, "\n", err$message), call. = FALSE)
})

# --- Pre-processing and Validation ---

# Ensure images are 2D grayscale for consistent processing
if (colorMode(img) == Color) {
  cat("Converting input image to grayscale.\n")
  img <- channel(img, "gray")
}
if (colorMode(mask) == Color) {
  cat("Converting mask image to grayscale.\n")
  mask <- channel(mask, "gray")
}

# CRITICAL FIX: Verify that image dimensions match
if (!all(dim(img) == dim(mask))) {
  stop(paste(
    "Error: Input image dimensions (", paste(dim(img), collapse="x"),
    ") do not match mask image dimensions (", paste(dim(mask), collapse="x"), ")."
  ), call. = FALSE)
}


cat("Labeling objects in the input image...\n")
# Create a labeled image by finding connected components.
# Input is treated as binary (non-zero pixels are foreground).
img_labels <- bwlabel(img)


cat("Calculating centroids for all objects...\n")
# Compute moment features to get the centroid (m.cx, m.cy) of each object.
features <- computeFeatures.moment(img_labels)

# Check if any objects were found before proceeding
if (is.null(features) || nrow(features) == 0) {
  cat("No objects found in the input image. Writing an empty image.\n")
  empty_img <- Image(0, dim=dim(img))
  writeImage(empty_img, outfile)
} else {
  cat("Found", nrow(features), "objects. Filtering based on the mask.\n")

  # Round the centroid coordinates to the nearest pixel
  centroids <- round(features[, c('m.cx', 'm.cy')])
  
  # Get mask dimensions for boundary checks
  mask_dims <- dim(mask)

  # Identify which objects to remove
  # An object is kept if its centroid corresponds to a black pixel in the mask.
  # We assume black is a low value (e.g., < 0.1) in the mask.
  to_remove <- c()
  for (i in 1:nrow(centroids)) {
    y_coord <- centroids[i, 'm.cy']
    x_coord <- centroids[i, 'm.cx']

    # ROBUSTNESS FIX: Check if coordinates are within the mask's bounds
    if (y_coord < 1 || y_coord > mask_dims[1] || x_coord < 1 || x_coord > mask_dims[2]) {
      # This centroid is outside the mask, mark it for removal
      to_remove <- c(to_remove, i)
      next # Skip to the next iteration
    }

    # Get the pixel value from the mask at the centroid's location
    # Note: R matrices are 1-indexed, coordinates are (row, col) which is (y, x)
    pixel_val <- mask[y_coord, x_coord]

    # If the pixel is not black (is bright), mark the object for removal
    if (pixel_val > 0.1) {
      to_remove <- c(to_remove, i)
    }
  }
  
  if (length(to_remove) > 0) {
    cat("Removing", length(to_remove), "unmatched objects.\n")
    img_filtered <- rmObjects(img_labels, to_remove)
  } else {
    cat("All objects were matched by the mask. No objects removed.\n")
    img_filtered <- img_labels
  }
  
  cat("Writing filtered image to:", outfile, "\n")
  # Convert the labeled image back to a binary (black and white) image
  # Any pixel > 0 in the filtered labeled image becomes 1 (white).
  writeImage(img_filtered > 0, outfile)
}

cat("Done.\n")