# PatchbayVIPS

**A Desktop-Class Visual Programming Environment for High-Performance Image Analysis, right in your browser.**

PatchbayVIPS is a professional-grade, web-based tool for designing, inspecting, and executing complex image processing pipelines. It delivers a fluid, desktop-application experience by combining a sophisticated **[Cappuccino](https://www.cappuccino.dev/)** frontend with a powerful, asynchronous **[Mojolicious](https://mojolicious.org/)** backend.

Visually orchestrate operations from best-in-class libraries like `libvips`, `ImageMagick`, `EBImage (R)`, and `YOLOv8 (Python)` without writing a single line of glue code.

<img width="1300" height="920" alt="screenshot" src="https://github.com/user-attachments/assets/f1325327-1a50-41e2-a12c-cbf9bade6311" />

## The Philosophy: Power Meets Usability

PatchbayVIPS is built on the principle that powerful tools should not be complicated to use. It achieves this by seamlessly integrating three key pillars:

1.  **A Rich Frontend:** A responsive, zero-compromise user interface that feels like a native desktop application.
2.  **An Intelligent Backend:** An asynchronous, non-blocking engine that manages complex workflows, caching, and execution with unparalleled efficiency.
3.  **Limitless Extensibility:** A framework designed from the ground up to be easily extended with your own custom scripts and tools.

## ImageJ on Steroids

For those familiar with **ImageJ**, PatchbayVIPS can be seen as its spiritual successor for the modern web era. While it shares the core philosophy of a visual, plugin-driven workflow, PatchbayVIPS elevates the concept in several key ways:
*   **Web-Native & Collaborative:** No installation required for end-users. Access your pipelines from anywhere.
*   **Language Agnostic:** You are not locked into a single language's ecosystem. Integrate the best tool for the job, whether it's Python, R, the mighty **ImageMagick**, or any other command-line executable.
*   **Universal Caching:** The intelligent, automatic caching of every operation provides a massive performance boost and enables a truly interactive and iterative workflow that is difficult to achieve in traditional tools.

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
    *   **`ImageMagick`:** For access to its legendary suite of filters and effects.
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
| `name` | `charcoal_effect` (display name) |
| `gui_xml` | `"<hbox>...see below...</hbox>"` |
| `gui_fields`| `"["factor"]"` |
| `parameter_template`| `"-charcoal %s"` |
| ... | ... |

Let's break down the key fields that make the magic happen:

### 2. The GUI Definition (`gui_xml`)

This field contains a snippet of **Cappuccino XML** that describes the interactive controls for the Inspector panel. The framework parses this to automatically generate a rich, native-feeling UI.

```xml
<hbox>
    <label halign="min" width="150" valign="center">Charcoal Factor:</label>
    <slider id="factorSlider" min="0" max="10" value="2" column="factor" />
    <textField id="factorTextField" column="factor" />
</hbox>
```
*   `<hbox>`: A horizontal container that arranges the elements side-by-side.
*   `<label>`: A static text label.
*   `<slider>`: An interactive slider.
    *   `min`, `max`, `value`: Standard slider controls.
    *   `column="factor"`: **This is the critical link.** It assigns the slider's value to a parameter named `factor`.
*   `<textField>`: A text box, also linked to the `factor` parameter, allowing for precise numerical input.

This simple XML generates a professional, fully-functional UI component without writing any JavaScript.

### 3. Linking GUI to Command (`gui_fields` & `parameter_template`)

These two fields bridge the gap between the user interface and the command-line script.

*   **`gui_fields`: `"["factor"]"`**
    *   This JSON array tells the backend which parameters to collect from the UI. In this case, it's just the value of the control linked to the `factor` column.

*   **`parameter_template`: `"-charcoal %s"`**
    *   This is the template for the command-line arguments. The backend takes the value of our `factor` parameter (e.g., `2` from the slider) and uses `sprintf` to format it into this string, resulting in `"-charcoal 2"`.

And that's it. The backend now has all the information it needs to dynamically build and execute the correct ImageMagick command based on the user's interaction with the slider. This simple yet powerful system allows you to wrap any command-line tool into a user-friendly, interactive node within minutes.

## Technology Stack

*   **Frontend:** **[Cappuccino](https://www.cappuccino.dev/)** Framework, JavaScript, HTML5
*   **Backend:** **[Mojolicious::Lite](https://mojolicious.org/)** (Perl)
*   **Database:** PostgreSQL
*   **Image Processing Engines:** `libvips`, `ImageMagick`, `R` (`EBImage`), `Python 3` (`ultralytics`)
