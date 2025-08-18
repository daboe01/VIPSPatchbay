#!/usr/bin/env Rscript

# Load necessary libraries
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# Define command-line options (input/output are now positional)
option_list <- list(
    make_option(c("-c", "--color"), type="character", default="White",
                help="Type of top-hat filter: 'White' or 'Black' [default: %default]"),
    make_option(c("-b", "--brush"), type="character", default="disk",
                help="Shape of the brush: 'disk', 'line', 'diamond', or 'box' [default: %default]"),
    make_option(c("-s", "--size"), type="integer", default=5,
                help="Size of the brush (an odd integer is recommended) [default: %default]")
)

# Create an argument parser
# The usage string is updated to show positional arguments
parser <- OptionParser(option_list=option_list,
                       usage = "%prog INFILE OUTFILE [options]",
                       description = "Applies a White or Black Top-Hat filter to an image using EBImage.")

# Parse the arguments, enabling positional arguments
parsed <- parse_args(parser, positional_arguments = 2)

# --- Input Validation ---
# `parsed` is a list with `$options` and `$args`
options <- parsed$options
args <- parsed$args

# Assign positional arguments
infile <- args[1]
outfile <- args[2]

# Check if input file exists
if (!file.exists(infile)) {
    stop(paste("Input file not found:", infile), call.=FALSE)
}

# Validate color argument
valid_colors <- c("white", "black")
if (!tolower(options$color) %in% valid_colors) {
    stop(paste("Invalid color. Choose from:", paste(valid_colors, collapse=", ")), call.=FALSE)
}

# Validate brush shape argument
valid_brushes <- c("disk", "line", "diamond", "box")
if (!tolower(options$brush) %in% valid_brushes) {
    stop(paste("Invalid brush shape. Choose from:", paste(valid_brushes, collapse=", ")), call.=FALSE)
}

# --- Core Logic ---

cat("Reading image:", infile, "\n")
tryCatch({
    img <- readImage(infile)
}, error = function(e) {
    stop(paste("Failed to read the input image. Is it a valid image format (PNG, JPEG, TIFF)?\nError:", e$message), call.=FALSE)
})


# Create the structuring element (brush)
cat(paste0("Creating a '", options$brush, "' brush of size ", options$size, "...\n"))
brush <- makeBrush(size = options$size, shape = options$brush)

# Apply the specified top-hat filter
processed_img <- NULL
if (tolower(options$color) == "white") {
    cat("Applying White-TopHat filter...\n")
    processed_img <- whiteTopHat(img, brush)
} else { # Must be "black" due to validation above
    cat("Applying Black-TopHat filter...\n")
    processed_img <- blackTopHat(img, brush)
}

# Save the resulting image
cat("Writing output image to:", outfile, "\n")
tryCatch({
    writeImage(processed_img, outfile)
}, error = function(e) {
    stop(paste("Failed to write the output image. Check permissions and path.\nError:", e$message), call.=FALSE)
})


cat("Done.\n")