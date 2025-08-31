#!/usr/bin/env Rscript

#
# Dieses Skript färbt die weißen Pixel eines Schwarz-Weiß-Bildes ein.
#
# Es führt die folgenden Schritte aus:
# 1. Liest ein Eingangsbild (wird als Schwarz-Weiß behandelt).
# 2. Identifiziert alle weißen Pixel (Vordergrund).
# 3. Erstellt ein neues RGB-Farbbild, bei dem die identifizierten Pixel in der
#    vom Benutzer gewählten Farbe (rot, grün, blau oder gelb) eingefärbt sind.
# 4. Schreibt das resultierende Farbbild in eine neue Datei.
#
# Verwendung:
#   Rscript colorize.R [options] INFILE OUTFILE
#
# Argumente:
#   INFILE        Der Pfad zum Schwarz-Weiß-Eingangsbild.
#   OUTFILE       Der Pfad zum Schreiben des eingefärbten Ausgabebildes.
#
# Optionen:
#   -c, --color <name>
#                 Die Farbe für die weißen Pixel. Muss eine der folgenden sein:
#                 'red', 'green', 'blue', 'yellow'.
#                 [Standard: 'red']
#
# Beispiel (weiße Pixel rot färben):
#   Rscript colorize.R --color red mask.png colored_mask.png
#
# Beispiel (weiße Pixel gelb färben):
#   Rscript colorize.R -c yellow binary_image.png yellow_output.png
#

# Unterdrückt Startmeldungen der Pakete für eine saubere Ausgabe
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argumenten-Verarbeitung ---

option_list <- list(
  make_option(c("-c", "--color"), type="character", default="red",
              help="Farbe für weiße Pixel. Eine von: 'red', 'green', 'blue', 'yellow'. [Standard: %default]")
)

parser <- OptionParser(
    option_list = option_list,
    usage = "%prog [options] INFILE OUTFILE",
    description = "Färbt weiße Pixel in einem Schwarz-Weiß-Bild ein."
)

# Argumente parsen (zwei positionelle Argumente erforderlich)
parsed_args <- parse_args(parser, positional_arguments = 2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# --- Argumente validieren ---

valid_colors <- c('red', 'green', 'blue', 'yellow')
if (!options$color %in% valid_colors) {
  stop(paste("Fehler: Ungültige Farbe '", options$color, "'. Muss eine von sein: ", paste(valid_colors, collapse=", ")), call. = FALSE)
}


# --- Bild laden ---

cat("Lese Bild von:", infile, "\n")
tryCatch({
  img <- readImage(infile)
}, error = function(e) {
  stop("Fehler: Kann Eingabedatei nicht lesen: ", e$message, call. = FALSE)
})


# --- Vorverarbeitung ---

# Stellt sicher, dass das Bild für die Analyse ein Graustufenbild ist
if (colorMode(img) == Color) {
  img <- channel(img, "gray")
}
# Stellt sicher, dass das Bild eine 2D-Matrix ist
if (length(dim(img)) > 2) {
  img <- img[,,1]
}

# --- Logik zum Einfärben ---

cat("Erstelle Farbkanäle...\n")
# Initialisiert die Kanäle für Rot, Grün und Blau als komplett schwarze Matrizen
dims <- dim(img)
r_chan <- g_chan <- b_chan <- matrix(0, nrow=dims[1], ncol=dims[2])

# Identifiziert die weißen Pixel (Vordergrund)
# Die Verwendung von > 0.1 ist robuster als == 1 für leichte Abweichungen in den Pixelwerten
is_white <- img > 0.1

cat(sprintf("Wende Farbe '%s' auf weiße Pixel an...\n", options$color))

# Verwendet eine switch-Anweisung, um die Farbkanäle basierend auf der Auswahl zu füllen
switch(
  options$color,
  "red"    = { r_chan[is_white] <- 1 },
  "green"  = { g_chan[is_white] <- 1 },
  "blue"   = { b_chan[is_white] <- 1 },
  "yellow" = {
    r_chan[is_white] <- 1
    g_chan[is_white] <- 1
  }
)

cat("Kombiniere Kanäle zu einem finalen Farbbild...\n")
# Verwendet rgbImage, um die drei Kanäle zu einem einzigen Farbbild-Objekt zusammenzufügen
final_image <- rgbImage(red=r_chan, green=g_chan, blue=b_chan)


# --- Ausgabe schreiben ---

cat("Schreibe eingefärbtes Bild nach:", outfile, "\n")
tryCatch({
  writeImage(final_image, outfile)
}, error = function(e) {
  stop("Fehler: Kann Ausgabedatei nicht schreiben: ", e$message, call. = FALSE)
})

cat("Fertig.\n")