# PatchbayVIPS

**A Desktop-Class Visual Programming Environment for High-Performance Image Analysis, right in your browser.**

PatchbayVIPS is a professional-grade, web-based tool for designing, inspecting, and executing complex image processing pipelines. It delivers a fluid, desktop-application experience by combining a sophisticated **Cappuccino** frontend with a powerful, asynchronous **Mojolicious** backend.

Visually orchestrate operations from best-in-class libraries like `libvips`, `EBImage (R)`, and `YOLOv8 (Python)` without writing a single line of glue code.

<img width="1300" height="920" alt="screenshot" src="https://github.com/user-attachments/assets/f1325327-1a50-41e2-a12c-cbf9bade6311" />

## The Philosophy: Power Meets Usability

PatchbayVIPS is built on the principle that powerful tools should not be complicated to use. It achieves this by seamlessly integrating three key pillars:

1.  **A Rich Frontend:** A responsive, zero-compromise user interface that feels like a native desktop application.
2.  **An Intelligent Backend:** An asynchronous, non-blocking engine that manages complex workflows, caching, and execution with unparalleled efficiency.
3.  **Limitless Extensibility:** A framework designed from the ground up to be easily extended with your own custom scripts and tools.

## Key Features

*   **Desktop-Class Cappuccino Frontend**
    *   Experience a rich, fluid user interface with smooth drag-and-drop, zooming, and panning.
    *   Build complex, non-linear workflows with an intuitive node-graph editor.
    *   Utilize desktop-style UI elements like sliders, pop-up buttons, and real-time text fields in the Inspector to fine-tune every parameter.

*   **High-Performance Asynchronous Backend**
    *   Built with **Mojolicious (Perl)**, the backend uses a promise-based, non-blocking architecture to handle long-running image processing tasks without ever freezing the UI.
    *   The system intelligently orchestrates command-line execution of any registered script, making it language-agnostic.

*   **Intelligent & Universal Cache Control**
    *   Never process the same data twice. The backend automatically caches the result of every node based on its unique set of parameters and input image(s).
    *   Change a parameter, and only the affected downstream nodes are re-computed. This provides instant feedback and dramatically accelerates iterative development.
    *   This powerful caching works out-of-the-box for **any shell script** you integrate, not just a predefined set.

*   **State-of-the-Art Operator Library**
    The system comes pre-loaded with a versatile set of operators leveraging industry-standard tools:
    *   **`libvips`:** For lightning-fast, memory-efficient core image processing (resize, blur, color operations, filters).
    *   **`EBImage (R)`:** For advanced scientific and biological image analysis (morphological operations, object segmentation, feature extraction).
    *   **`YOLOv8 (Python)`:** For cutting-edge, AI-driven object detection and segmentation using the latest models.

*   **Effortless Extensibility**
    Adding your own custom tools is a core feature, not an afterthought. The process is simple:
    1.  **Write Your Script:** Create a command-line script in any language (Python, R, Ruby, Bash, etc.) that accepts an input image path and writes an output image.
    2.  **Define the GUI:** Create a simple **Cappuccino XML** file describing the inspector UI for your script's parameters (e.g., sliders, text fields).
    3.  **Register the Operator:** Add a single entry to the `blocks_catalogue` database table, pointing to your script and its GUI definition. Your new node is instantly available in the editor.

## Technology Stack

*   **Frontend:** **Cappuccino** Framework, JavaScript, HTML5
*   **Backend:** **Mojolicious::Lite** (Perl)
*   **Database:** PostgreSQL
*   **Core Image Processing:** `libvips`
*   **Scientific Analysis:** `R` (leveraging libraries like `EBImage`)
*   **AI / Machine Learning:** `Python 3` (leveraging libraries like `ultralytics` for YOLOv8)

## Getting Started

*(This section can be expanded with detailed setup instructions)*

1.  **Prerequisites:**
    *   Perl and `cpanm`
    *   PostgreSQL server
    *   `libvips` command-line tools (`vips`)
    *   An `R` installation with required libraries (e.g., `EBImage`, `argparse`)
    *   A `Python 3` installation with required libraries (e.g., `ultralytics`, `opencv-python`)

2.  **Installation:**
    ```bash
    # Clone the repository
    git clone <your-repo-url>
    cd PatchbayVIPS

    # Install Perl dependencies from cpanfile
    cpanm --installdeps .

    # Set up the PostgreSQL database and run the schema
    # (Detailed instructions here)

    # Start the development server
    morbo backend.pl
    ```

3.  **Usage:**
    *   Open `http://localhost:3000/Frontend/index.html` in a supported web browser.
    *   Create a new project.
    *   Use the "Add Operator..." button to start building your first pipeline
