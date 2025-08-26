#!/usr/bin/env Rscript

#
# This script performs a flood fill operation on an image using seed points
# derived from the centroids of objects in a separate seed image.
#
# It performs the following steps:
# 1. Reads an input image and a binary seed image.
# 2. Finds all connected objects (blobs) in the seed image.
# 3. Calculates the centroid (center point) for each blob.
# 4. Uses these centroids as the starting points for a flood fill on the input image.
# 5. The fill uses a user-specified color and tolerance.
# 6. Writes the modified image to an output file.
#
# Usage:
#   Rscript floodfill_from_seeds.R [options] INFILE SEEDFILE OUTFILE
#
# Arguments:
#   INFILE        Path to the target image to be filled.
#   SEEDFILE      Path to the black and white image containing blobs for seeding.
#   OUTFILE       Path to write the filled output image.
#
# Options:
#   -c, --color <name>
#                 The color to use for the fill. Must be one of:
#                 'red', 'green', 'blue', 'black', 'white', 'gray'.
#                 [default: 'red']
#
#   -t, --tolerance <value>
#                 The color tolerance for the fill (0.0 to 1.0). A higher
#                 value allows the fill to spread into similar, but not
#                 identical, colors.
#                 [default: 0.05]
#
# Example:
#   Rscript floodfill_from_seeds.R --color blue --tolerance 0.1 image.png seeds.png filled_image.png
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-c", "--color"), type="character", default="red",
              help="The fill color. One of: 'red', 'green', 'blue', 'black', 'white', 'gray'. [default: %default]"),
  make_option(c("-t", "--tolerance"), type="double", default=0.05,
              help="Color tolerance for the fill (0.0 to 1.0). [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE SEEDFILE OUTFILE",
    description = "Performs a flood fill using centroids from a seed image."
)

# Parse arguments, requiring three positional arguments
parsed_args <- parse_args(parser, positional_arguments = 3)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
seedfile <- args[2]
outfile <- args[3]

# --- Validate Arguments ---

valid_colors <- c('red', 'green', 'blue', 'black', 'white', 'gray')
if (!options$color %in% valid_colors) {
  stop(paste("Error: Invalid color '", options$color, "'. Must be one of: ", paste(valid_colors, collapse=", ")), call. = FALSE)
}

if (options$tolerance < 0 || options$tolerance > 1) {
  stop("Error: Tolerance must be a number between 0.0 and 1.0.", call. = FALSE)
}


# --- Image Loading ---

cat("Reading input image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(err) {
  stop(paste("Error: Cannot read input file:", infile, "\n", err$message), call. = FALSE)
})

cat("Reading seed image from:", seedfile, "\n")
tryCatch({
  seed_img <- readImage(seedfile)
}, error = function(err) {
  stop(paste("Error: Cannot read seed file:", seedfile, "\n", err$message), call. = FALSE)
})


# --- Find Centroids from Seed Image ---

cat("Finding centroids in seed image...\n")

# Ensure seed image is grayscale
if (colorMode(seed_img) == Color) {
  seed_img <- channel(seed_img, "gray")
}

# Label connected components (blobs) in the seed image
# We assume non-black pixels are part of blobs
seed_labels <- bwlabel(seed_img)

# Compute features to get the centroids
features <- computeFeatures.moment(seed_labels)

if (is.null(features) || nrow(features) == 0) {
  cat("Warning: No objects found in the seed image. Writing the original image to output.\n")
  writeImage(img, outfile)
  cat("Done.\n")
  quit(save = "no", status = 0)
}

# Extract and round the centroid coordinates (m.cx, m.cy)
# The floodFill function requires integer coordinates
centroids <- round(features[, c('m.cx', 'm.cy')])
cat("Found", nrow(centroids), "centroids to use as seed points.\n")


# --- Perform Flood Fill ---

# The target image must be in Color mode to fill with a named color
if (colorMode(img) == Grayscale) {
  cat("Converting input image to color mode for filling.\n")
  img <- toRGB(img)
}

cat(sprintf("Performing flood fill with color '%s' and tolerance %.2f...\n",
            options$color, options$tolerance))

# Perform the flood fill using the list of centroids
img_filled <- floodFill(
  x = img,
  pts = centroids,
  col = options$color,
  tolerance = options$tolerance
)


# --- Write Output ---

cat("Writing filled image to:", outfile, "\n")
tryCatch({
  writeImage(img_filled, outfile)
}, error = function(err) {
  stop(paste("Error: Cannot write output file:", outfile, "\n", err$message), call. = FALSE)
})

cat("Done.\n")