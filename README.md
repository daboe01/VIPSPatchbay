# PatchbayVIPS

**Visually build, inspect, and run complex image processing pipelines right in your browser.**

PatchbayVIPS is a powerful, web-based visual programming environment designed for rapid prototyping and execution of image analysis and computer vision workflows. It combines an intuitive node-graph interface with a high-performance backend that orchestrates calls to `libvips`, `R`, and `Python`, giving you the best of all worlds.

<img width="1300" height="920" alt="screenshot" src="https://github.com/user-attachments/assets/f1325327-1a50-41e2-a12c-cbf9bade6311" />

## Core Concepts

Say goodbye to writing and rewriting tedious scripts. With PatchbayVIPS, you build your image processing logic by placing and connecting operator nodes on a canvas. Each node represents a specific operation (e.g., blur, threshold, object detection), and its parameters can be tweaked in real-time from the Inspector panel.

The flow is simple:
1.  **Load** an input image.
2.  **Add** operators from the library.
3.  **Connect** them to define the processing pipeline.
4.  **Inspect** the output of any node along the way.
5.  **Run** the full pipeline to get your final result.

## Key Features

*   **Visual Pipeline Editor:** An intuitive drag-and-drop, node-based interface. Create complex, non-linear workflows with ease.
*   **Real-time Previews:** Instantly inspect the output of any node in your pipeline. This allows for rapid parameter tuning and debugging without re-running the entire process.
*   **Powerful & Extensible Backend:** The core engine leverages the speed and efficiency of `libvips`, extended with the statistical power of `R` and the flexibility of `Python` for specialized and AI-driven tasks.
*   **Intelligent Caching:** Never process the same data twice. The backend automatically caches the result of every operation. If you change a parameter upstream, only the affected downstream nodes are re-computed, saving significant time.
*   **Rich Operator Library:** Comes packed with a wide range of operators:
    *   **Transforms:** Resize, Flip, Rotate, Crop
    *   **Filters:** Gaussian Blur, Sharpen, Sobel & Canny Edge Detection
    *   **Color:** Colourspace Conversion, Negate, Gamma, False Colour
    *   **Analysis & Segmentation:** Thresholding, Morphological Operations (Open, Close, Erode, Dilate), Distance Maps, and Adaptive Thresholding.
    *   **Object-Based Filtering:** Remove objects by size, aspect ratio, or roundness.
    *   **AI/ML:** Integrated **YOLO World** for prompt-based object segmentation.
*   **Asynchronous Processing:** Built on a non-blocking Perl and Mojolicious backend, the UI remains fast and responsive even while executing heavy-duty pipelines.
*   **Stateless API:** Includes an endpoint for processing images on-the-fly without permanently storing them, perfect for integration into other services.

## How It Works

PatchbayVIPS consists of a JavaScript frontend that communicates with a Mojolicious (Perl) backend.

1.  The user designs a pipeline in the browser.
2.  The pipeline structure and parameters are stored in a **PostgreSQL** database.
3.  When a pipeline is executed, the backend traverses the node graph.
4.  For each node, it checks the **cache** for an existing result.
5.  On a cache miss, it constructs and executes a command-line call to the appropriate tool (`vips`, `Rscript`, or `python3`).
6.  The resulting image is saved to disk and its unique ID is stored in the cache before being passed to the next node.

## Technology Stack

*   **Backend:** Perl, Mojolicious::Lite
*   **Database:** PostgreSQL
*   **Core Image Processing:** `libvips`
*   **Scientific/Statistical Processing:** `R`
*   **AI/ML & Custom Scripting:** `Python`
*   **Frontend:** HTML, JavaScript

## Getting Started

*(This section can be expanded with detailed setup instructions)*

1.  **Prerequisites:**
    *   Perl and `cpanm`
    *   PostgreSQL server
    *   `libvips` command-line tools
    *   An `R` installation with required libraries
    *   A `Python 3` installation with required libraries

2.  **Installation:**
    ```bash
    # Clone the repository
    git clone <your-repo-url>
    cd PatchbayVIPS

    # Install Perl dependencies
    cpanm --installdeps .

    # Set up the database
    # ... create database and run schema.sql ...

    # Start the backend server
    morbo backend.pl
    ```

3.  **Usage:**
    *   Open `http://localhost:3000/Frontend/index.html` in your web browser.
    *   Create a new project from the left-hand panel.
    *   Right-click on the canvas or use the "Add Operator" button to start building!

---
