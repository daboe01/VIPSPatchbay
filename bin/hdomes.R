#!/usr/bin/env Rscript

#
# Dies ist ein robustes Wrapper-Skript für den benutzerdefinierten 'hdomes'-Befehl.
#
# Es löst zwei Hauptprobleme des zugrundeliegenden Befehls:
# 1. Es stellt sicher, dass das Eingangsbild immer ein 8-Bit-Graustufenbild ist,
#    um den Fehler "Input image is not 8 bpp grayscale" zu vermeiden.
# 2. Es fängt alle Fehler während der Verarbeitung ab (z.B. "pixRead failed"
#    oder Abstürze des hdomes-Befehls).
#
# Im Falle eines Fehlers wird anstelle eines Absturzes ein schwarzes Bild
# der gleichen Größe wie das Eingangsbild als Ausgabe geschrieben.
#
# Verwendung:
#   Rscript hdomes_wrapper.R INFILE OUTFILE HEIGHT
#
# Argumente:
#   INFILE        Der Pfad zum Eingangsbild.
#   OUTFILE       Der Pfad zum Schreiben des Ausgabebildes.
#   HEIGHT        Der Höhen-Parameter für den hdomes-Algorithmus.
#
# Beispiel:
#   Rscript hdomes_wrapper.R ./input.png ./result.png 12
#

# Unterdrückt Startmeldungen der Pakete für eine saubere Ausgabe
suppressPackageStartupMessages(library(EBImage))

# --- Konfiguration ---
# Passen Sie diesen Pfad an, wenn sich Ihr hdomes-Befehl an einem anderen Ort befindet.
HDOMES_EXECUTABLE <- "/Users/daboe01/src/VIPSPatchbay/bin/hdomes"


# --- Argumenten-Verarbeitung ---
args <- commandArgs(trailingOnly = TRUE)

if (length(args) != 3) {
  stop("Verwendung: Rscript hdomes_wrapper.R INFILE OUTFILE HEIGHT", call. = FALSE)
}

infile <- args[1]
outfile <- args[2]
height_param <- args[3]


# --- Haupt-Logik mit Fehlerbehandlung ---

# Wir definieren eine Fehlerbehandlungs-Funktion, die ein schwarzes Bild schreibt.
# Sie benötigt die Dimensionen des Originalbildes als Argument.
write_black_image_on_error <- function(error_message, img_dims) {
  warning(paste("Ein Fehler ist aufgetreten:", error_message))
  cat("Aktion bei Fehler: Erstelle ein schwarzes Bild.\n")
  
  if (is.null(img_dims)) {
    # Fallback, falls die Dimensionen nicht ermittelt werden konnten
    img_dims <- c(512, 512) 
    warning("Original-Dimensionen konnten nicht ermittelt werden, verwende 512x512 als Fallback.")
  }
  
  black_img <- Image(0, dim = img_dims)
  
  tryCatch({
    writeImage(black_img, outfile)
    cat("Schwarzes Fallback-Bild wurde erfolgreich nach:", outfile, "geschrieben.\n")
  }, error = function(e) {
    stop("Konnte nicht einmal das schwarze Fallback-Bild schreiben: ", e$message)
  })
}


# Der gesamte Prozess wird in tryCatch eingeschlossen
original_dims <- NULL
tryCatch({
  
  # --- 1. Bild laden und vorbereiten ---
  cat("Lese Eingangsbild:", infile, "\n")
  img <- readImage(infile)
  original_dims <- dim(img) # Dimensionen für den Fehlerfall speichern
  
  cat("Konvertiere zu 8-Bit-Graustufenbild...\n")
  # Stellt sicher, dass das Bild Graustufen ist
  if (colorMode(img) == Color) {
    img <- channel(img, "gray")
  }
  # Stellt sicher, dass es 2D ist
  if (length(dim(img)) > 2) {
    img <- img[,,1]
  }
  
  # Skaliert die Werte auf den 8-Bit-Bereich [0, 255]
  img_8bit <- img # * 255
  
  # --- 2. Temporäre Dateien für die Kommandozeile erstellen ---
  temp_infile <- tempfile(fileext = ".png")
  temp_outfile <- tempfile(fileext = ".png")
  print(temp_outfile)
  # Definitiv als 8-Bit-PNG speichern
  writeImage(1 - img_8bit, temp_infile, bits.per.sample = 8)

  # --- 3. Den hdomes-Befehl ausführen ---
  cat("Führe den hdomes-Befehl aus...\n")
  
  # system2 ist robuster als system()
  status <- system2(
    HDOMES_EXECUTABLE,
    args = c(temp_infile, temp_outfile, height_param),
    stdout = TRUE, # Fängt die Standardausgabe auf
    stderr = TRUE  # Fängt die Fehlerausgabe auf
  )
  
  # Überprüft, ob der Befehl erfolgreich war (Exit-Code 0)
  exit_code <- attr(status, "status")
  if (!is.null(exit_code) && exit_code != 0) {
    # Wenn nicht, werfe einen Fehler, der von tryCatch gefangen wird
    stop(paste("hdomes-Befehl ist fehlgeschlagen mit Exit-Code", exit_code, ". Ausgabe:", paste(status, collapse="\n")))
  }
  
  # --- 4. Erfolgreiches Ergebnis verarbeiten ---
  cat("hdomes erfolgreich. Lese Ergebnisbild...\n")
  result_img <- readImage(temp_outfile)
  
  cat("Schreibe finales Bild nach:", outfile, "\n")
  writeImage(result_img, outfile)
  
  # Temporäre Dateien aufräumen
  unlink(c(temp_infile, temp_outfile))
  
}, error = function(e) {
  # --- 5. Fehlerbehandlung: Wird bei JEDEM Fehler im try-Block ausgeführt ---
  write_black_image_on_error(e$message, original_dims)
})

cat("Fertig.\n")