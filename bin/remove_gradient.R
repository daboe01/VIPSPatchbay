#!/usr/bin/env Rscript

#
# This script removes the background gradient from an image on a line-by-line basis.
#
# It performs the following steps:
# 1. Reads an input image.
# 2. Optionally converts it to grayscale.
# 3. Iterates through each row of pixels in the image.
# 4. For each row, it estimates the background gradient using one of two methods:
#    a) A simple linear trend fit (default).
#    b) A smoothed local regression (LOESS) to handle noise and non-linear trends.
# 5. It subtracts the estimated background from the original pixel values.
# 6. The processed rows are combined back into a final image and written to a file.
#
# Usage: Rscript remove_gradient.R [options] INFILE OUTFILE
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-s", "--smooth"), action="store_true", default=FALSE,
              help="Enable smoothing (LOESS) to estimate a non-linear background and remove noise."),
  make_option(c("-p", "--span"), type="double", default=0.5,
              help="Smoothing span for LOESS fit (e.g., 0.1 to 1.0). Only used with --smooth. [default: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Removes a background gradient from an image line by line."
)

# Parse arguments, requiring two positional arguments (INFILE, OUTFILE)
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

# Convert to grayscale if necessary
if (colorMode(img) == Color) {
  cat("Converting input image to grayscale.\n")
  img <- channel(img, "gray")
}

if (length(dim(img)) == 3) {
  	  img <- img[,,1]
  }

# Get image dimensions
img_dims <- dim(img)
width <- img_dims[1]
height <- img_dims[2]

cat("Image dimensions:", width, "x", height, "\n")
if (options$smooth) {
  cat(sprintf("Smoothing enabled with LOESS span = %.2f\n", options$span))
} else {
  cat("Smoothing option disabled. Background will be estimated using a linear trend.\n")
}

# --- Line-by-Line Gradient Removal ---

cat("Processing image line by line...\n")

	A <- apply(img, c(2), function(v)
	{
        d1=data.frame(x=1:length(v), y=v)
        v= v-predict(loess(y~x, data=d1))
	}
	)
	img_corrected_data =normalize(Image(A))

  if (options$smooth) {
  for (y in 1:height) {
  line_pixels <- img_corrected_data[, y]
  x_coords <- 1:width
  
    # --- Smoothing using LOESS line fitting (removes noise and non-linear trend) ---
    loess_fit <- loess(unclass(line_pixels) ~ x_coords, span = options$span)
    corrected_line <- predict(loess_fit)

  img_corrected_data[, y] <- corrected_line
}
}
# --- Final Image Creation and Writing ---

cat("Creating the final image...\n")

# Normalize the image data to be in the range [0, 1]
# Avoid division by zero if the image is flat
range_val <- max(img_corrected_data) - min(img_corrected_data)
if (range_val == 0) {
  img_corrected_data <- img_corrected_data - min(img_corrected_data)
} else {
  img_corrected_data <- (img_corrected_data - min(img_corrected_data)) / range_val
}


cat("Restoring matrix dimensions...\n")
dim(img_corrected_data) <- c(width, height)


# Create a new EBImage object from the corrected data
img_final <- Image(img_corrected_data)


cat("Writing the corrected image to:", outfile, "\n")
tryCatch({
  writeImage(img_final, outfile)
}, error = function(err) {
  stop(paste("Error: Cannot write output file:", outfile, "\n", err$message), call. = FALSE)
})

cat("Done.\n")