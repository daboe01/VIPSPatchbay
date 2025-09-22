#!/usr/bin/env Rscript

#
# Dieses Skript kombiniert ein bis drei Graustufenbilder in die Rot-, Grün-
# und Blau-Kanäle eines einzigen Farbbildes. Die Eingabedateien werden
# positionell zugewiesen. Nicht angegebene Kanäle werden automatisch durch
# schwarze Bilder ersetzt.
#
# Es führt die folgenden Schritte aus:
# 1. Liest 1-3 Eingabedateien und 1 Ausgabedatei als positionelle Argumente.
# 2. Das erste Bild wird als Rot-Kanal interpretiert, das zweite (falls vorhanden)
#    als Grün-Kanal, das dritte (falls vorhanden) als Blau-Kanal.
# 3. Das erste geladene Bild bestimmt die Zieldimensionen.
# 4. Alle weiteren geladenen Bilder werden auf Übereinstimmung der Dimensionen geprüft.
# 5. Fehlende Kanäle werden durch schwarze Bilder in den Zieldimensionen ersetzt.
# 6. Alle drei Kanäle werden zu einem RGB-Farbbild kombiniert und gespeichert.
#
# Verwendung:
#   Rscript compose_channels.R [R_INFILE] [G_INFILE] [B_INFILE] OUTFILE
#
# Beispiele:
#   # Ein Bild als Rot-Kanal verwenden, Rest schwarz -> Rotes Bild
#   Rscript compose_channels.R mask.png result_red.png
#
#   # Rot und Grün kombinieren -> Gelbes Bild
#   Rscript compose_channels.R r.png g.png result_yellow.png
#
#   # Alle drei Kanäle aus verschiedenen Dateien zusammensetzen
#   Rscript compose_channels.R r.png g.png b.png result_full.png
#

# Unterdrückt Startmeldungen der Pakete für eine saubere Ausgabe
suppressPackageStartupMessages(library(EBImage))
suppressPackageStartupMessages(library(optparse))

# --- Argumenten-Verarbeitung ---

parser <- OptionParser(
    usage = "%prog [R_INFILE] [G_INFILE] [B_INFILE] OUTFILE",
    description = "Kombiniert 1-3 Graustufenbilder positionell zu einem RGB-Farbbild."
)

# Akzeptiert eine variable Anzahl von Argumenten:
# Minimal 2 (R_INFILE, OUTFILE), maximal 4 (R, G, B, OUTFILE)
parsed_args <- parse_args(parser, positional_arguments = c(2, 4))
args <- parsed_args$args

# Das letzte Argument ist immer die Ausgabedatei
num_args <- length(args)
outfile <- args[num_args]

# Alle anderen Argumente sind Eingabedateien
infiles <- args[-num_args]
num_infiles <- length(infiles)

# --- Bilder laden und vorbereiten ---

img_dims <- NULL
r_img <- g_img <- b_img <- NULL

# Funktion zum Laden, Verarbeiten und Überprüfen eines Kanals
load_channel <- function(filepath, channel_name, current_dims) {
  cat(sprintf("Lese %s-Kanal von: %s\n", channel_name, filepath))
  tryCatch({
    img <- readImage(filepath)
    if (colorMode(img) == Color) img <- channel(img, "gray")
    if (length(dim(img)) > 2) img <- img[,,1]
    
    if (is.null(current_dims)) {
      current_dims <- dim(img)
      cat(sprintf("Referenz-Dimensionen gesetzt auf %s.\n", paste(current_dims, collapse="x")))
    } else if (!all(dim(img) == current_dims)) {
      stop(sprintf("Dimensions-Konflikt! Das %s-Kanal-Bild (%s) passt nicht zur Referenz-Dimension (%s).",
                   channel_name, paste(dim(img), collapse="x"), paste(current_dims, collapse="x")), call.=FALSE)
    }
    return(list(img=img, dims=current_dims))
  }, error = function(e) stop(sprintf("Fehler beim Lesen des %s-Kanals: ", channel_name), e$message))
}

# Verarbeitet die Eingabedateien basierend auf ihrer Position
if (num_infiles >= 1) {
  result <- load_channel(infiles[1], "Rot", img_dims)
  r_img <- result$img
  img_dims <- result$dims
}
if (num_infiles >= 2) {
  result <- load_channel(infiles[2], "Grün", img_dims)
  g_img <- result$img
  img_dims <- result$dims
}
if (num_infiles >= 3) {
  result <- load_channel(infiles[3], "Blau", img_dims)
  b_img <- result$img
  img_dims <- result$dims
}

# --- Fehlende Kanäle durch schwarze Bilder ersetzen ---

if (is.null(g_img)) {
  cat("Grün-Kanal nicht angegeben, verwende schwarzes Bild.\n")
  g_img <- Image(0, dim=img_dims)
}
if (is.null(b_img)) {
  cat("Blau-Kanal nicht angegeben, verwende schwarzes Bild.\n")
  b_img <- Image(0, dim=img_dims)
}

# --- Kanäle kombinieren ---

cat("Kombiniere Kanäle zu einem finalen Farbbild...\n")
final_image <- rgbImage(red = r_img, green = g_img, blue = b_img)

# --- Ausgabe schreiben ---

cat("Schreibe kombiniertes Bild nach:", outfile, "\n")
tryCatch({
  writeImage(final_image, outfile)
}, error = function(e) stop("Fehler: Kann Ausgabedatei nicht schreiben: ", e$message))

cat("Fertig.\n")```