#!/usr/bin/env Rscript

#
# This script filters objects in a binary image based on a mask.
#
# It performs the following steps:
# 1. Reads a binary input image containing objects (blobs).
# 2. Reads a mask image containing black dots that mark the blobs to be retained.
# 3. Verifies that both images have the same dimensions.
# 4. Identifies all black dots in the mask image and calculates their centroids.
# 5. Labels all connected objects (blobs) in the input image.
# 6. Checks which blobs in the input image are "hit" by a centroid from the mask.
# 7. Removes any blob that was not marked by a mask centroid.
# 8. Writes the resulting filtered binary image to a new file.
#
# The mask's black dots should be positioned over the blobs to be kept.
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


# --- Image Loading ---

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

print(dim(img))
print(dim(mask))
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

# CRITICAL: Verify that image dimensions match
if (!all(dim(img) == dim(mask))) {
  stop(paste(
    "Error: Input image dimensions (", paste(dim(img), collapse="x"),
    ") do not match mask image dimensions (", paste(dim(mask), collapse="x"), ")."
  ), call. = FALSE)
}

  if (length(dim(img)) == 3) {
  	  img <- img[,,1]
  }
  if (length(dim(mask)) == 3) {
  	  mask <- mask[,,1]
  }

# --- Image Processing ---

cat("Labeling objects (dots) in the mask image...\n")
# `bwlabel` considers non-zero pixels as the foreground to be labeled.
mask_labels <- bwlabel(mask)

cat("Calculating centroids for mask dots...\n")
# Compute moment features to get the centroid (m.cx, m.cy) of each dot.
mask_features <- computeFeatures.moment(mask_labels)

# Check if any dots were found in the mask before proceeding
if (is.null(mask_features) || nrow(mask_features) == 0) {
  cat("No dots found in the mask image. Writing an empty image.\n")
  empty_img <- Image(0, dim=dim(img))
  writeImage(empty_img, outfile)
  
} else {
  cat("Found", nrow(mask_features), "dots in the mask.\n")

  cat("Labeling objects (blobs) in the input image...\n")
  img_labels <- bwlabel(img)
  total_blobs <- max(img_labels)

  if (total_blobs == 0) {
    cat("No objects found in the input image. Writing an empty image.\n")
    empty_img <- Image(0, dim=dim(img))
    writeImage(empty_img, outfile)
  } else {
    cat("Found", total_blobs, "blobs in the input image. Probing with mask centroids.\n")

    # Round the mask centroid coordinates to the nearest pixel
    mask_centroids <- round(mask_features[, c('m.cx', 'm.cy')])
    img_dims <- dim(img_labels)
    
    # Identify which blobs in the input image are "hit" by a mask centroid
    ids_to_keep <- c()
    for (i in 1:nrow(mask_centroids)) {
      x_coord <- mask_centroids[i, 'm.cx']
      y_coord <- mask_centroids[i, 'm.cy']

      # ROBUSTNESS: Check if centroid coordinates are within the image's bounds
      if (TRUE) {
        
        # Get the label ID of the blob at the centroid's location
        # A value of 0 means the centroid hit the background.
        blob_id <- img_labels[x_coord, y_coord][[1]]
        print(blob_id)
        # If the centroid landed on a blob, record that blob's ID
        if (blob_id > 0) {
          ids_to_keep <- c(ids_to_keep, blob_id)
        }
      }
    }
    
    # Get the unique set of blob IDs to retain
    ids_to_keep <- unique(ids_to_keep)

    if (length(ids_to_keep) > 0) {
      cat(length(ids_to_keep), "blobs will be retained.\n")
      
      # Determine which object IDs to remove by finding the difference
      # between all blob IDs and the ones we want to keep.
      all_ids <- 1:total_blobs
      to_remove <- setdiff(all_ids, ids_to_keep)
      
      if (length(to_remove) > 0) {
        cat("Removing", length(to_remove), "unmarked blobs.\n")
        img_filtered <- rmObjects(img_labels, to_remove)
      } else {
        cat("All blobs were marked by the mask. No objects removed.\n")
        img_filtered <- img_labels
      }
    } else {
      cat("No input image blobs were marked by the mask centroids. Creating empty image.\n")
      # If no blobs were hit, create an empty image for the output
      img_filtered <- Image(0, dim=dim(img))
    }
    
    cat("Writing filtered image to:", outfile, "\n")
    # Convert the final labeled image back to a binary (black and white) image
    # Any pixel > 0 in the filtered labeled image becomes 1 (white).
    writeImage(img_filtered > 0, outfile)
  }
}

cat("Done.\n")
