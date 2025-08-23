import argparse
import cv2
import numpy as np
from ultralytics import YOLO
import sys

def visualize_centroids(result_obj, outfile):
    """Creates and saves a black image with white dots for each detected centroid."""
    print("\n--- Mode: Visualizing Centroids ---")
    
    orig_height, orig_width = result_obj.orig_shape
    black_canvas = np.zeros((orig_height, orig_width, 3), dtype=np.uint8)
    
    dot_color = (255, 255, 255)  # White
    dot_radius = 5
    
    for box in result_obj.boxes:
        x1, y1, x2, y2 = box.xyxy[0]
        center_x = int((x1 + x2) / 2)
        center_y = int((y1 + y2) / 2)
        cv2.circle(black_canvas, (center_x, center_y), dot_radius, dot_color, thickness=-1)
        
    cv2.imwrite(outfile, black_canvas)
    print(f"\nSuccess! Centroid visualization saved to: {outfile}")

def perform_floodfill(result_obj, infile, outfile):
    """Performs seeded region growing to extract the full shapes detected by YOLO."""
    print("\n--- Mode: Seeded Region Growing (Flood-fill) ---")

    # Step 1: Get Centroids from YOLO Detections (our "seeds")
    print("Step A: Extracting YOLO centroids as seeds...")
    yolo_centroids = []
    for box in result_obj.boxes:
        x1, y1, x2, y2 = box.xyxy[0]
        center_x = int((x1 + x2) / 2)
        center_y = int((y1 + y2) / 2)
        yolo_centroids.append((center_x, center_y))

    # Step 2: Find All Shapes in Original Image
    print("Step B: Finding all distinct shapes in the original image...")
    original_image_gray = cv2.imread(infile, cv2.IMREAD_GRAYSCALE)
    if original_image_gray is None:
        print(f"Error: Could not load image from {infile}", file=sys.stderr)
        return

    _, binary_image = cv2.threshold(original_image_gray, 127, 255, cv2.THRESH_BINARY_INV)
    num_labels, labels_map = cv2.connectedComponents(binary_image)
    print(f"Found {num_labels - 1} total shapes.")

    # Step 3: Identify which shapes were "hit" by our seeds
    print("Step C: Identifying which shapes to keep based on seeds...")
    labels_to_keep = set()
    for cx, cy in yolo_centroids:
        if 0 <= cy < labels_map.shape[0] and 0 <= cx < labels_map.shape[1]:
            label_id = labels_map[cy, cx]
            if label_id != 0:
                labels_to_keep.add(label_id)
    
    if not labels_to_keep:
        print("Warning: YOLO detected objects, but their centroids did not land on any shapes.")
        return
    print(f"Identified {len(labels_to_keep)} shapes to keep.")

    # Step 4: Create and save the final mask
    print("Step D: Generating the final output mask...")
    final_mask_boolean = np.isin(labels_map, list(labels_to_keep))
    final_mask_image = final_mask_boolean.astype(np.uint8) * 255
    
    cv2.imwrite(outfile, final_mask_image)
    print(f"\nSuccess! Flood-fill mask saved to: {outfile}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="A versatile tool to analyze images with YOLO-World. Can either visualize object centroids or extract full shapes using seeded region growing.",
        formatter_class=argparse.RawTextHelpFormatter
    )
    # Required Arguments
    parser.add_argument("infile", help="Path to the input image file.")
    parser.add_argument("outfile", help="Path to save the output image.")
    parser.add_argument("thres", type=float, help="Confidence threshold for detection (e.g., 0.01).")
    parser.add_argument("prompt", nargs='+', help="The natural language prompt (e.g., 'black ovals').")
    
    # Optional Flag Argument
    parser.add_argument(
        "--floodfill",
        action="store_true",  # This makes it a flag. If present, its value is True.
        help="If set, performs seeded region growing to extract the full shapes.\nIf not set, it will only output the centroid dots."
    )
    
    args = parser.parse_args()

    if not (0.0 <= args.thres <= 1.0):
        print(f"Error: The threshold must be a value between 0.0 and 1.0.", file=sys.stderr)
        sys.exit(1)

    text_prompt = " ".join(args.prompt)
    print("--- Initializing: Loading Model and Running Inference ---")
    print(f"Prompt: '{text_prompt}', Confidence threshold: {args.thres}")
    
    try:
        model = YOLO('yolov8s-worldv2.pt')
        model.set_classes([text_prompt])
        results = model.predict(args.infile, conf=args.thres, verbose=False)
    except Exception as e:
        print(f"An error occurred during model prediction: {e}", file=sys.stderr)
        sys.exit(1)

    result_obj = results[0]

    if not (hasattr(result_obj, 'boxes') and len(result_obj.boxes) > 0):
        print("\nNo objects were detected with the given confidence threshold. Exiting.")
        sys.exit(0)

    print(f"Detected {len(result_obj.boxes)} objects.")

    # --- Main Logic: Decide which function to call based on the flag ---
    if args.floodfill:
        perform_floodfill(result_obj, args.infile, args.outfile)
    else:
        visualize_centroids(result_obj, args.outfile)
