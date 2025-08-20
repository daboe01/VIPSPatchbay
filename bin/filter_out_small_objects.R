#!/usr/bin/env Rscript

#
# This script processes an image to remove small objects.
#
# It performs the following steps:
# 1. Reads an image.
# 2. Converts it to a binary (black and white) image by thresholding.
# 3. Identifies all connected objects (blobs).
# 4. Calculates the area of every object.
# 5. Removes any object with an area smaller than the average area.
# 6. Writes the resulting cleaned-up image to a new file.
#
# Usage: Rscript filter_small_objects.R <INFILE> <OUTFILE>
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))

# --- Argument Handling ---

# Get command-line arguments provided after the script name
args <- commandArgs(trailingOnly = TRUE)

# Check if exactly two arguments (infile and outfile) are provided
if (length(args) != 2) {
  # Print a helpful usage message and exit if arguments are incorrect
  stop("Usage: Rscript filter_small_objects.R <INFILE> <OUTFILE>", call. = FALSE)
}

# Assign the positional arguments to variables
infile <- args[1]
outfile <- args[2]


# --- Image Processing ---

cat("Reading image from:", infile, "\n")

# Use a tryCatch block for robust file reading
tryCatch({
  # 'e' is used as the variable name to match your original snippet
  e <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})


cat("Thresholding image and labeling objects...\n")

# 1. Create a binary image by thresholding (pixels > 0.5 become TRUE)
#    and then label the connected components (the objects).
e.lab <- bwlabel(e > 0.5)

# 2. Handle color images: if the labeled image has 3 dimensions (a color channel),
#    collapse it to the first 2D slice.
if (length(dim(e.lab)) == 3) {
  e.lab <- e.lab[,,1]
}

cat("Calculating shape features for all objects...\n")

# 3. Compute shape features (like area, perimeter, etc.) for each labeled object.
#    The result is a matrix where each row corresponds to an object.
features <- computeFeatures.shape(e.lab)

# Check if any objects were found before proceeding
if (is.null(features) || nrow(features) == 0) {
  cat("No objects found in the image after thresholding. Writing an empty image.\n")
  # Create an empty image with the same dimensions as the original
  empty_img <- Image(0, dim=dim(e))
  writeImage(empty_img, outfile)
} else {
  cat("Found", nrow(features), "objects. Filtering out those smaller than the average size.\n")

  # 4. Identify which objects to remove.
  #    - Calculate the mean (average) area of all objects found.
  #    - 'irm' will contain the row indices of objects with an area less than the mean.
  mean_area <- mean(features[,'s.area'])
  irm <- which(features[,'s.area'] < mean_area)

  # 5. Remove the identified objects from the labeled image.
  e.lab.1 <- rmObjects(e.lab, irm)

  cat("Writing filtered image to:", outfile, "\n")

  # 6. Write the final, cleaned image to the output file.
  #    The output is a labeled image where small objects have been removed.
  #    Using normalize() makes the output visually clearer (scales pixel values to 0-1).
  writeImage(normalize(e.lab.1), outfile)
}

cat("Done.\n")