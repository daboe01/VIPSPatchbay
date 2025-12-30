# PatchbayVIPS

**A Visual Programming Environment for High-Performance Image Analysis, right in your browser.**

PatchbayVIPS is a professional-grade, web-based tool for designing, inspecting, and executing complex image processing pipelines. It delivers a fluid, desktop-application experience by combining a sophisticated **[Cappuccino](https://www.cappuccino.dev/)** frontend with a powerful, asynchronous **[Mojolicious](https://mojolicious.org/)** backend.

Visually orchestrate operations from best-in-class libraries like `libvips`, `ImageMagick`, `EBImage (R)`, and `YOLOv8 (Python)` without writing a single line of glue code.

<img width="1300" height="920" alt="screenshot" src="https://github.com/user-attachments/assets/f1325327-1a50-41e2-a12c-cbf9bade6311" />

## The Philosophy: Power Meets Usability

PatchbayVIPS is built on the principle that powerful tools should not be complicated to use. It achieves this by seamlessly integrating three key pillars:

1.  **A Rich Frontend:** A responsive, zero-compromise user interface that feels like a native desktop application.
2.  **An Intelligent Backend:** An asynchronous, non-blocking engine that manages complex workflows, caching, and execution with unparalleled efficiency.
3.  **Limitless Extensibility:** A framework designed from the ground up to be easily extended with your own custom scripts and tools.

## ImageJ on Steroids: The Power of the Pipeline

For those familiar with **ImageJ**, PatchbayVIPS can be seen as its spiritual successor for the modern web era. While ImageJ is a landmark tool, PatchbayVIPS offers a paradigm shift in workflow. The key advantage is not just caching or web access, but the creation of **self-documenting, reproducible pipelines of chained operations.**

*   **Self-Documenting Pipelines:** Forget trying to decipher linear scripts or macro recordings. In PatchbayVIPS, the visual graph *is* the documentation. The flow of data, operator dependencies, and all parameters are explicitly laid out, making even the most complex workflows instantly understandable and shareable.
*   **Guaranteed Reproducibility:** Every pipeline—including all nodes, their precise connections, and every parameter setting—is saved as a single, self-contained entity. This eliminates ambiguity and ensures that any analysis can be perfectly replicated by anyone at any time, a cornerstone of scientific and analytical integrity.
*   **Interactive & Non-Destructive Exploration:** Tweak any parameter at any stage of the pipeline and instantly see the final result. The ability to inspect the output of any intermediate node makes debugging and algorithm development incredibly intuitive, allowing for rapid, non-destructive experimentation.
*   **Polyglot Power:** Build these robust pipelines by seamlessly combining the fastest tools (`libvips`), the most versatile filters (`ImageMagick`), powerful statistical packages (`R`), and the latest AI models (`Python`), all in one visual interface.

## Key Features

*   **Desktop-Class Cappuccino Frontend**
    *   Experience a rich, fluid user interface with smooth drag-and-drop, zooming, and panning, built on the [Cappuccino](https://www.cappuccino.dev/) framework.
    *   Build complex, non-linear workflows with an intuitive node-graph editor.
    *   Utilize desktop-style UI elements like sliders, pop-up buttons, and real-time text fields in the Inspector to fine-tune every parameter.

*   **High-Performance Asynchronous Backend**
    *   Built with **[Mojolicious (Perl)](https://mojolicious.org/)**, the backend uses a promise-based, non-blocking architecture to handle long-running image processing tasks without ever freezing the UI.
    *   The system intelligently orchestrates command-line execution of any registered script, making it truly language-agnostic.

*   **Intelligent & Universal Cache Control**
    *   Never process the same data twice. The backend automatically caches the result of every node based on its unique set of parameters and input image(s).
    *   Change a parameter, and only the affected downstream nodes are re-computed. This provides instant feedback and dramatically accelerates iterative development.
    *   This powerful caching works out-of-the-box for **any shell script** you integrate, not just a predefined set.

*   **State-of-the-Art Operator Library**
    The system comes pre-loaded with a versatile set of operators leveraging industry-standard tools:
    *   **`libvips`:** For lightning-fast, memory-efficient core image processing.
    *   **`ImageMagick`:** For access to its legendary suite of hundreds of filters and effects.
    *   **`EBImage (R)`:** For advanced scientific and biological image analysis.
    *   **`YOLOv8 (Python)`:** For cutting-edge, AI-driven object detection.

## Effortless Extensibility: A How-To Example

Adding your own custom tools is a core feature. All it takes is a command-line script and a single database entry to define its interface. Let's demonstrate by wrapping an **ImageMagick** `convert` command.

**Our Goal:** Create a node that applies a "charcoal" artistic effect. The command-line syntax is:
`convert INFILE.png -charcoal 2 OUTFILE.png`
We want the `2` to be an interactive slider in our UI.

### 1. The Database Registration

We register this new operator in the `blocks_catalogue` table with a single entry. This row is the complete "definition" of the node.

| Field | Value |
| :--- | :--- |
| `command` | `convert` |
| `display_name` | `Charcoal Effect` |
| `gui_xml` | `"<hbox>...see below...</hbox>"` |
| `gui_fields`| `"["factor"]"` |
| `parameter_template`| `"-charcoal %s"` |
| ... | ... |

### 2. The GUI Definition (`gui_xml`)

This field contains a snippet of **Cappuccino XML** that describes the interactive controls for the Inspector panel. The framework parses this to automatically generate a rich, native-feeling UI.

```xml
<hbox>
    <label halign="min" width="150" valign="center">Charcoal Factor:</label>
    <slider min="0" max="10" value="2" column="factor" />
    <textField column="factor" />
</hbox>
```
*   `<hbox>`: A horizontal container that arranges the elements side-by-side.
*   `<label>`: A static text label.
*   `<slider>`: An interactive slider.
    *   `min`, `max`, `value`: Standard slider controls.
    *   `column="factor"`: **This is the critical link.** It assigns the slider's value to a parameter named `factor`.
*   `<textField>`: A text box, also linked to the `factor` parameter, allowing for precise numerical input.

This simple XML generates a professional, fully-functional UI component without writing any JavaScript. This declarative approach means you can design complex interfaces for any command-line tool with just a few lines of XML.

## Technology Stack

*   **Frontend:** **[Cappuccino](https://www.cappuccino.dev/)**
*   **Backend:** **[Mojolicious::Lite](https://mojolicious.org/)**
*   **Database:** **[PostgreSQL](https://www.postgresql.org/)**
*   **Image Processing Engines:** [libvips](https://www.libvips.org/), [ImageMagick](https://imagemagick.org/), `R` (e.g. [EBImage](https://bioconductor.org/packages/release/bioc/html/EBImage.html)), `Python 3` (e.g. [ultralytics](https://www.ultralytics.com/))

## Installation

> [!NOTE]
> These instructions are based on the current understanding of the environment and have not been tested.

This application is designed to be run in a Docker container. A `Dockerfile` is provided to build the environment.

### Building the Docker Image

1.  **Build the image:**
    ```sh
    docker build -t patchbay-vips .
    ```

### Running the Application

1.  **Run the container:**
    ```sh
    docker run -p 3036:3036 patchbay-vips
    ```
2.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3036`.
