# Online IDE for Web Development

## Overview

This project is a simple yet powerful browser-based Integrated Development Environment (IDE) designed for front-end web development. It provides a clean and intuitive interface for writing and testing HTML, CSS, and JavaScript code directly in your browser. The live preview panel updates in real-time, offering immediate feedback on your changes.

This tool is perfect for quick prototyping, learning web technologies, or testing small code snippets without the need for a complex local development setup.

## Core Features

*   **Live Preview:** See the results of your code instantly in the preview panel. The editor automatically refreshes the preview shortly after you stop typing.
*   **Tri-Panel Editor:** A tabbed interface allows you to easily switch between dedicated editors for HTML, CSS, and JavaScript.
*   **Responsive Design Testing:** Quickly check your layout on different screen sizes with built-in toggles for Mobile, Tablet, and Desktop views.
*   **Code Formatting:** A "Beautify" feature cleans up and formats your HTML, CSS, or JS code with a single click, ensuring readability and consistent style.
*   **Undo/Redo History:** Each code editor (HTML, CSS, JS) maintains its own independent history, allowing you to undo and redo changes for each language separately.
*   **Theme Switcher:** Choose between a comfortable Light mode and a sleek Dark mode to suit your preference. Your theme choice is saved locally.
*   **Session Persistence:** Your code is automatically saved to your browser's local storage. You can close the tab and come back later to find your work right where you left it.
*   **Built-in Console:** The IDE captures `console.log`, `console.error`, and other console messages from your JavaScript code and displays them in an integrated console panel, making debugging easier.
*   **Save & Download:** Save your entire project (HTML, CSS, and JS) as a single `.json` file to your computer for backup or sharing.
*   **Fullscreen Editor:** Expand the code panel to fill the entire screen for a focused, distraction-free coding experience.
*   **Keyboard Shortcuts:**
    *   `Ctrl`/`Cmd` + `Z`: Undo in the active editor.
    *   `Ctrl`/`Cmd` + `Y`: Redo in the active editor.
    *   `Ctrl`/`Cmd` + `S`: Triggers the "Save Project" download.
    *   `Ctrl`/`Cmd` + `Enter`: Manually run the code.
    *   `Tab`: Inserts a 4-space indent instead of changing focus.
*   **Open in New Tab:** Render your final project in a full-sized, separate browser tab.

## How to Use

1.  **Launch the IDE:** Simply open the `index.html` file in any modern web browser.
2.  **Start Coding:**
    *   The user interface is split into two main sections: the **Code Panel** on the left and the **Preview Panel** on the right.
    *   In the Code Panel, use the `HTML`, `CSS`, and `JS` tabs to switch between the different editors.
    *   Write your code in the respective text areas.
3.  **View Your Work:**
    *   The Preview Panel will automatically update as you type.
    *   Alternatively, click the **Run Code** button for an immediate refresh.
    *   Use the responsive view buttons (📱, 📟, 🖥️) above the preview to see how your project looks on different devices.
4.  **Use the Tools:**
    *   Click the **Format** button (⚙️) to beautify the code in the currently active tab.
    *   Use the **Undo** (↶) and **Redo** (↷) buttons or keyboard shortcuts to manage your edits.
    *   Click the **Clear** button to erase all code from the active editor.
    *   Open the integrated **Console** below the preview to see logs or error messages from your JavaScript.

## File Structure

The project is self-contained within three primary files:

*   `index.html`: This file defines the complete structure and layout of the IDE, including all buttons, panels, and text areas.
*   `style.css`: This file contains all the styling rules for the application's appearance, layout, responsiveness, and themes (Light/Dark).
*   `script.js`: This is the core of the application. It handles all functionality, including tab switching, live updates, local storage, code formatting, event listeners, and all other interactive features.

## Dependencies

The project utilizes the **JS-Beautify** library for its code formatting capabilities. It is included via a CDN in the `index.html` file and does not require any local installation.
