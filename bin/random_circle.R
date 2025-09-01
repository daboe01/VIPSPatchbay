#!/usr/bin/env Rscript

#
# This script draws a single, filled circle at a random position on an
# existing input image.
#
# Usage:
#   Rscript draw_circle_on_image.R [options] INFILE OUTFILE
#

# Suppress package startup messages for cleaner output
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argument Handling ---

option_list <- list(
  make_option(c("-c", "--color"), type="character", default="red", dest="color",
              help="Color for the circle. One of: 'red', 'green', 'blue', 'black', 'white', 'gray'. [default: %default]"),
  make_option("--min-radius", type="integer", default=50, dest="min_radius",
              help="Minimaler Radius des Kreises. [Standard: %default]"),
  make_option("--max-radius", type="integer", default=200, dest="max_radius",
              help="Maximaler Radius des Kreises. [Standard: %default]"),
  make_option("--min-x", type="integer", default=0, dest="min_x",
              help="Minimale X-Koordinate für den Mittelpunkt. [Standard: %default]"),
  make_option("--max-x", type="integer", default=512, dest="max_x",
              help="Maximale X-Koordinate für den Mittelpunkt. [Standard: %default]"),
  make_option("--min-y", type="integer", default=0, dest="min_y",
              help="Minimale Y-Koordinate für den Mittelpunkt. [Standard: %default]"),
  make_option("--max-y", type="integer", default=512, dest="max_y",
              help="Maximale Y-Koordinate für den Mittelpunkt. [Standard: %default]")
)

parser <- OptionParser(option_list=option_list, usage="%prog [options] INFILE OUTFILE", description="Draws a random circle on an image.")

# Use positional_arguments = TRUE to handle options that appear after positional args.
parsed_args <- parse_args(parser, positional_arguments = TRUE)

options <- parsed_args$options
args <- parsed_args$args

# Check that we have exactly two positional arguments left over
if (length(args) != 2) {
  print_help(parser)
  stop("Error: Exactly two positional arguments (INFILE and OUTFILE) are required.", call. = FALSE)
}

infile <- args[1]
outfile <- args[2]

# --- Parameter validieren ---
valid_colors <- c('red', 'green', 'blue', 'black', 'white', 'gray')
if (!options$color %in% valid_colors) stop("Error: Invalid color. Must be one of: ", paste(valid_colors, collapse=", "))
# Now this check will work correctly because options$min_radius will not be NULL
if (options$min_radius > options$max_radius) stop("Error: --min-radius cannot be greater than --max-radius.")
if (options$min_x > options$max_x) stop("Error: --min-x cannot be greater than --max-x.")
if (options$min_y > options$max_y) stop("Error: --min-y cannot be greater than --max-y.")

# --- Image Loading ---
cat("Reading image from:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(e) {
  stop("Error: Cannot read input file: ", e$message, call. = FALSE)
})

# --- Parameter generieren ---
cat("Generating random parameters...\n")
radius <- sample(options$min_radius:options$max_radius, 1)
cx <- sample(options$min_x:options$max_x, 1)
cy <- sample(options$min_y:options$max_y, 1)

cat(sprintf("Parameters chosen: Center=(%d, %d), Radius=%d, Color=%s\n", cx, cy, radius, options$color))

# --- Bild zeichnen ---
cat("Drawing circle on image...\n")

# Ensure image is in Color mode to accept a named color
if (colorMode(img) == Grayscale) {
  img <- toRGB(img)
}

# Draws the filled circle directly onto the loaded image
final_image <- drawCircle(
  img = img,
  x = cx,
  y = cy,
  radius = radius,
  col = options$color,
  fill = TRUE
)

# --- Ausgabe schreiben ---
cat("Writing image to:", outfile, "\n")
tryCatch({
  writeImage(final_image, outfile)
}, error = function(e) {
  stop("Error: Cannot write output file: ", e$message, call. = FALSE)
})

cat("Done.\n")