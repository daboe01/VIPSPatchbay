#!/bin/bash

# This script acts as a simple bridge between the backend and the complex
# UNet inference command.
# The backend will call this script like:
#   run_unet_inference.sh /path/to/input.png /path/to/output.png

# --- Configuration ---
# Set the full, absolute paths to your Python executable, script, and model file.
PYTHON_EXEC="/Users/daboe01/src/VIPSPatchbay/bin/unet_endothel/unet-env/bin/python3"
INFERENCE_SCRIPT="/Users/daboe01/src/VIPSPatchbay/bin/unet_endothel/inference.py"
MODEL_PATH="/Users/daboe01/src/VIPSPatchbay/bin/unet_endothel/densenet_unet_corneal_endothelium.pth"

# --- Argument Handling ---
# The backend provides the input file as the first argument ($1)
# and the output file as the second argument ($2).
INFILE="$1"
OUTFILE="$2"

# --- Execution ---
# Execute the full, correctly formatted Python command.
# Using quotes to handle any spaces in file paths.
"$PYTHON_EXEC" "$INFERENCE_SCRIPT" \
    --model "$MODEL_PATH" \
    --input "$INFILE" \
    --output "$OUTFILE"