#!/usr/bin/env Rscript

#
# Dieses Skript zeichnet vier gefüllte Quadrate in die Ecken eines Bildes.
#
# Es führt die folgenden Schritte aus:
# 1. Liest ein Eingangsbild.
# 2. Zeichnet vier Quadrate mit einer vom Benutzer festgelegten Seitenlänge
#    und Farbe in jede der vier Ecken des Bildes.
# 3. Speichert das resultierende modifizierte Bild in einer Datei.
#
# Verwendung:
#   Rscript draw_squares_on_image.R [options] INFILE OUTFILE
#

# Unterdrückt Startmeldungen der Pakete für eine saubere Ausgabe
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argumenten-Verarbeitung ---

option_list <- list(
  make_option(c("-s", "--width"), type="integer", default=50, help="Seitenlänge der Quadrate in Pixeln. [Standard: %default]"),
  make_option(c("-c", "--color"), type="character", default="white", help="Farbe der Quadrate: 'black', 'white', 'red', 'green', 'blue'. [Standard: %default]")
)

parser <- OptionParser(option_list=option_list, usage="%prog [options] INFILE OUTFILE", description="Zeichnet Quadrate in die Bildecken.")

# Use positional_arguments = TRUE to handle options that appear after positional args.
parsed_args <- parse_args(parser, positional_arguments = TRUE)

options <- parsed_args$options
args <- parsed_args$args

# Validate that we have exactly two positional arguments left over
if (length(args) != 2) {
    print_help(parser)
    stop("Error: Exactly two positional arguments (INFILE and OUTFILE) are required.", call. = FALSE)
}

infile <- args[1]
outfile <- args[2]

# --- Parameter validieren ---
valid_colors <- c('black', 'white', 'red', 'green', 'blue')
if (!options$color %in% valid_colors) {
  stop(paste("Fehler: Ungültige Farbe '", options$color, "'. Muss eine von sein: ", paste(valid_colors, collapse=", ")), call.=FALSE)
}
print(options)
if (options$width < 1) stop("Fehler: --width muss positiv sein.")

# --- Bild laden ---
cat("Lese Bild von:", infile, "\n")
tryCatch({
  img <- readImage(infile)
  # Anmerkung: Dieser Teil reduziert ein Farbbild auf seinen Rotkanal.
  # Um eine echte Graustufenkonvertierung durchzuführen, wäre eine andere Methode erforderlich.
  # Für die aktuelle Logik des Skripts ist es aber in Ordnung.
  if (length(dim(img)) > 2) { img <- toGray(img) }

}, error = function(e) {
  stop("Fehler: Kann Eingabedatei nicht lesen: ", e$message, call. = FALSE)
})

# --- Bild vorbereiten ---
img_dims <- dim(img)
print(img_dims)

# KORRIGIERT: Zuweisung von Höhe und Breite vertauscht, um R's Matrix-Indizierung [Zeile, Spalte] zu entsprechen.
img_height <- img_dims[1]
img_width <- img_dims[2]
sq_width <- options$width

if (sq_width > img_width / 2 || sq_width > img_height / 2) {
  stop("Fehler: --width ist zu groß und würde die Quadrate überlappen lassen.")
}

cat(sprintf("Zeichne %dx%d große Quadrate in der Farbe '%s' auf das Bild...\n",
            sq_width, sq_width, options$color))

# Konvertiert das Bild in den Farbmodus, falls eine Farbe gezeichnet werden soll
# und das Eingangsbild ein Graustufenbild ist.
is_color_request <- options$color %in% c('red', 'green', 'blue')
if (is_color_request && colorMode(img) == Grayscale) {
  cat("Konvertiere Eingangsbild in den Farbmodus.\n")
  img <- toRGB(img)
}

# --- Quadrate zeichnen ---
top <- 1:sq_width
left <- 1:sq_width
bottom <- (img_height - sq_width + 1):img_height
right <- (img_width - sq_width + 1):img_width

if (colorMode(img) == Color) {
  r <- if (options$color == "red") 1 else if (options$color == "white") 1 else 0
  g <- if (options$color == "green") 1 else if (options$color == "white") 1 else 0
  b <- if (options$color == "blue") 1 else if (options$color == "white") 1 else 0
  
  # Hinweis: In R wird auf Matrizen mit [Zeile, Spalte] zugegriffen
  img[top, left, 1] <- r; img[top, left, 2] <- g; img[top, left, 3] <- b
  img[top, right, 1] <- r; img[top, right, 2] <- g; img[top, right, 3] <- b
  img[bottom, left, 1] <- r; img[bottom, left, 2] <- g; img[bottom, left, 3] <- b
  img[bottom, right, 1] <- r; img[bottom, right, 2] <- g; img[bottom, right, 3] <- b
} else {
  pixel_value <- if (options$color == "white") 1 else 0
  img[top, left] <- pixel_value
  img[top, right] <- pixel_value
  img[bottom, left] <- pixel_value
  img[bottom, right] <- pixel_value
}

# --- Ausgabe schreiben ---
cat("Schreibe Bild nach:", outfile, "\n")
tryCatch({
  writeImage(img, outfile)
}, error = function(e) {
  stop("Fehler: Kann Ausgabedatei nicht schreiben: ", e$message, call. = FALSE)
})

cat("Fertig.\n")