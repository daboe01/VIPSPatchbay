#!/usr/bin/env Rscript

#
# This script identifies all blobs in a grayscale image and replaces each one
# with a small, filled circle located at the blob's centroid. The circle's
# color will be the average intensity of the original blob.
#
# It performs the following steps:
# 1. Reads a grayscale input image.
# 2. Automatically thresholds the image (Otsu's method) to identify objects.
# 3. Calculates the centroid for each blob.
# 4. Calculates the average pixel intensity for each original blob.
# 5. Creates a new, black image of the same size.
# 6. Draws a filled circle on the new image at each centroid, using the
#    blob's average intensity as the color.
# 7. Writes the resulting image of circles to a new file.
#
# Usage:
#   Rscript replace_blobs_with_circles.R [options] INFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the input grayscale image.
#   OUTFILE       Path to write the output image of circles.
#
# Options:
#   -r, --radius <integer>
#                 The radius of the circles to be drawn, in pixels.
#                 [default: 5]
#
# Example:
#   Rscript replace_blobs_with_circles.R -r 3 input.png centroids.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-r", "--radius"), type="integer", default=5,
              help="The radius of the replacement circles in pixels. [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Replaces blobs with circles of their average intensity."
)

parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# --- Image Loading and Pre-processing ---

cat("Reading input image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})

# Ensure image is grayscale for analysis
if (colorMode(img) == Color) {
  cat("Converting input image to grayscale.\n")
  img <- channel(img, "gray")
}

# Ensure the image is a 2D matrix
if (length(dim(img)) > 2) {
  img <- img[,,1]
}

# --- Find Centroids and Blobs ---

cat("Thresholding with Otsu's method to find blobs...\n")
# Create a binary mask to identify where the blobs are
binary_mask <- img > otsu(img)
# Label the connected components from the mask
labeled_img <- bwlabel(binary_mask)

cat("Calculating centroids...\n")
# Compute features to get the centroids (center of mass)
features <- computeFeatures.moment(labeled_img)

if (is.null(features) || nrow(features) == 0) {
  cat("No objects found in the input image. Writing an empty image.\n")
  empty_img <- Image(0, dim=dim(img))
  writeImage(empty_img, outfile)
  cat("Done.\n")
  quit(save = "no", status = 0)
}

# Extract and round the centroid coordinates to the nearest pixel
centroids <- round(features[, c('m.cx', 'm.cy')])
num_objects <- nrow(centroids)
cat("Found", num_objects, "objects. Replacing them with circles of average intensity.\n")


# --- Create New Image with Circles ---

# Create a new, empty (black) image with the same dimensions as the input
output_img <- Image(0, dim = dim(img))

# Iterate through each centroid and draw a filled circle
for (i in 1:num_objects) {
  x_coord <- centroids[i, 'm.cx']
  y_coord <- centroids[i, 'm.cy']
  
  # --- KEY CHANGE ---
  # Calculate the mean intensity of the pixels in the original image
  # that correspond to the current blob label.
  mean_intensity <- mean(img[labeled_img == i])
  
  # The drawCircle function returns the modified image
  output_img <- drawCircle(
    img = output_img,
    x = x_coord,
    y = y_coord,
    radius = options$radius,
    col = mean_intensity, # Draw with the calculated average gray value
    fill = TRUE           # Make the circle solid
  )
}

# --- Write Output ---

cat("Writing new image with circles to:", outfile, "\n")
tryCatch({
  writeImage(output_img, outfile)
}, error = function(err) {
  stop(paste("Error: Cannot write output file:", outfile, "\n", err$message), call. = FALSE)
})

cat("Done.\n")