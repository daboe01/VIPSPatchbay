#!/bin/bash

# This script is a flexible bridge for the UNet inference command.
# The backend will now call this script with THREE arguments:
#   run_unet_inference_v2.sh <INFILE> <OUTFILE> <MODEL_PATH>

# --- Configuration ---
# Paths to the Python executable and inference script remain fixed.
PYTHON_EXEC="/Users/daboe01/src/VIPSPatchbay/bin/unet_endothel/unet-env/bin/python3"
INFERENCE_SCRIPT="/Users/daboe01/src/VIPSPatchbay/bin/unet_endothel/inference.py"

# --- Argument Handling ---
# The backend provides three positional arguments.
INFILE="$1"
OUTFILE="$2"
MODEL_PATH="$3" # The model path is now the 3rd argument.

# --- Input Validation ---
# It's good practice to check if the model path was actually provided.
if [ -z "$MODEL_PATH" ]; then
    echo "Error: Model path was not provided as the third argument." >&2
    exit 1
fi

# --- Execution ---
# The command now uses the MODEL_PATH variable passed from the backend.
"$PYTHON_EXEC" "$INFERENCE_SCRIPT" \
    --model "$MODEL_PATH" \
    --input "$INFILE" \
    --output "$OUTFILE"
