#!/usr/bin/env Rscript

# Load necessary libraries
suppressPackageStartupMessages(library(EBImage))

args <- commandArgs(trailingOnly = TRUE)

# Check if exactly two arguments (infile and outfile) are provided
if (length(args) != 2) {
  # Print a helpful usage message and exit if arguments are incorrect
  stop("Usage: Rscript your_script_name.R <INFILE> <OUTFILE>", call. = FALSE)
}

# Assign the positional arguments to variables for clarity
infile <- args[1]
outfile <- args[2]

# Check if input file exists
if (!file.exists(infile)) {
    stop(paste("Input file not found:", infile), call.=FALSE)
}

# --- Core Logic ---

cat("Reading image:", infile, "\n")
tryCatch({
    img <- readImage(infile)
    if (length(dim(img)) == 3) {
  		img <- img[,,1]
}

}, error = function(e) {
    stop(paste("Failed to read the input image. Is it a valid image format (PNG, JPEG, TIFF)?\nError:", e$message), call.=FALSE)
})


# Apply the specified top-hat filter
processed_img <- 1-img

# Save the resulting image
cat("Writing output image to:", outfile, "\n")
tryCatch({
    writeImage(processed_img, outfile)
}, error = function(e) {
    stop(paste("Failed to write the output image. Check permissions and path.\nError:", e$message), call.=FALSE)
})


cat("Done.\n")