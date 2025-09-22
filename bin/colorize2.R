#!/usr/bin/env Rscript

#
# Dieses Skript färbt ein Graustufenbild ein, indem es die Helligkeitswerte
# des Originalbildes auf eine gewählte Zielfarbe überträgt.
#
# Es führt die folgenden Schritte aus:
# 1. Liest ein Graustufenbild.
# 2. Erstellt drei leere Farbkanäle (Rot, Grün, Blau).
# 3. Weist die Pixelintensitäten des Graustufenbildes je nach gewählter
#    Zielfarbe einem oder mehreren Farbkanälen zu.
#    - z.B. für "rot": Ein grauer Pixel mit Wert 0.5 wird zu (0.5, 0, 0).
# 4. Kombiniert die Kanäle zu einem RGB-Bild und speichert es.
#
# Verwendung:
#   Rscript map_grayscale_to_color.R [options] INFILE OUTFILE
#
# Argumente:
#   INFILE        Der Pfad zum Graustufen-Eingangsbild.
#   OUTFILE       Der Pfad zum Schreiben des eingefärbten Ausgabebildes.
#
# Optionen:
#   -c, --color <name>
#                 Die Zielfarbe. Muss eine der folgenden sein:
#                 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta'.
#                 [Standard: 'red']
#
# Beispiel (Graustufenbild in Grüntönen darstellen):
#   Rscript map_grayscale_to_color.R -c green input.png output_green.png
#

# Unterdrückt Startmeldungen der Pakete für eine saubere Ausgabe
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argumenten-Verarbeitung ---

option_list <- list(
  make_option(c("-c", "--color"), type="character", default="red",
              help="Zielfarbe: 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta'. [Standard: %default]")
)

parser <- OptionParser(option_list=option_list, usage="%prog [options] INFILE OUTFILE")
parsed_args <- parse_args(parser, positional_arguments=2)
options <- parsed_args$options
args <- parsed_args$args

infile <- args[1]
outfile <- args[2]

# --- Argumente validieren ---

valid_colors <- c('red', 'green', 'blue', 'yellow', 'cyan', 'magenta')
if (!options$color %in% valid_colors) {
  stop(paste("Fehler: Ungültige Farbe '", options$color, "'. Muss eine von sein: ", paste(valid_colors, collapse=", ")), call.=FALSE)
}

# --- Bild laden und vorbereiten ---

cat("Lese Bild von:", infile, "\n")
tryCatch({
  gray_img <- readImage(infile)
}, error = function(e) stop("Fehler: Kann Eingabedatei nicht lesen: ", e$message))

if (colorMode(gray_img) == Color) {
  cat("Warnung: Eingangsbild ist farbig. Konvertiere zu Graustufen.\n")
  gray_img <- channel(gray_img, "gray")
}
if (length(dim(gray_img)) > 2) { gray_img <- gray_img[,,1] }

# --- Farbkanäle erstellen ---

cat("Erstelle leere Farbkanäle...\n")

# --- KORREKTUR IST HIER ---
# Erstellt ein schwarzes Bild mit den gleichen Dimensionen wie das Eingangsbild.
# Dies wird für die leeren Kanäle verwendet und stellt sicher, dass alle
# Objekte vom Typ 'Image' sind.
black_img <- Image(0, dim=dim(gray_img))

# Initialisiert alle Kanäle als 'Image'-Objekte
r_chan <- g_chan <- b_chan <- black_img

cat(sprintf("Bilde Graustufen auf die Farbe '%s' ab...\n", options$color))

# Das Graustufenbild (ebenfalls ein 'Image'-Objekt) wird den entsprechenden Kanälen zugewiesen
switch(
  options$color,
  "red"     = { r_chan <- gray_img },
  "green"   = { g_chan <- gray_img },
  "blue"    = { b_chan <- gray_img },
  "yellow"  = { r_chan <- gray_img; g_chan <- gray_img },
  "cyan"    = { g_chan <- gray_img; b_chan <- gray_img },
  "magenta" = { r_chan <- gray_img; b_chan <- gray_img }
)

cat("Kombiniere Kanäle zu einem finalen Farbbild...\n")
# Jetzt sind alle drei Eingaben garantiert 'Image'-Objekte, und die Funktion gelingt
final_image <- rgbImage(red=r_chan, green=g_chan, blue=b_chan)

# --- Ausgabe schreiben ---

cat("Schreibe eingefärbtes Bild nach:", outfile, "\n")
tryCatch({
  writeImage(final_image, outfile)
}, error = function(e) stop("Fehler: Kann Ausgabedatei nicht schreiben: ", e$message))

cat("Fertig.\n")