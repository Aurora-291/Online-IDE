# Online IDE

This online IDE is a simple web application inspired from vscode and github codespace or codepen it provides a seperate area for typing 3 files and currently i have allowed to code only single html file and might add multiple file feature in future
**Key Features:**

* **Live Preview:** the project contains live preview with 3 modes which are mobile , tablet and dektop im also trying to add new window and seperate model for devices like samsung or apple
* **Code Formatting:** on a single click it uses code aligner like style50 from cs50 to beautify the code
* **Integrated Console:** i have intergrated the console log feature to see the changes and errors each time
* **Light & Dark Themes:** currently i have added only 2 modes and might include multiple mode in future
* **Undo/Redo Functionality:** i have also included undo and redo functionality so that you can version control the project and might include git graph in future
* **Local Storage:** i have coded to store your code locally so that only you can access it from your system
* **Project Download:** added a feature to save entire project as zip file for easy to use on other tools like vscode so you can export the code easily and working on importing code
* **Fullscreen Mode:** by clicking `F11` you can use my project in full screen

**Getting Started:**

Just open `index.html` in your browser – no installation needed!


**How to Use:**

1. **Open `index.html`:** launch the IDE in any browser.
2. **Write Your Code:** Use the `HTML`, `CSS`, and `JS` tabs in the Code Panel (left side) the preview panel (right side) updates live when you save or auto reloades.
3. **Preview & Test:** Use the device preview buttons (📱, 📟, 🖥️) to check responsiveness Click "Run Code" for an immediate refresh.
4. **Utilize the Tools:**  Format code (⚙️), undo/redo (↶/↷), clear code, and check the console for log.


**How I Built It:**

this online ide is built with 100% html css, and javascript. no frameworks, no bundlers, just pure web-native technologies.

**Why I Built It:**

building this online ide as a personal challenge to deepen my understanding of core web technologies i have always been fascinated by tools like CodePen and wanted to demystify how they work by building my own version from scratch.

**What I Struggled With:**

* Undo/Redo logic
* iframe Security and Scope
* State Management
* Alignment of the webpage in all devices
* preview popup

**What I have learned:**

* The Power of iframes
* Practical Performance Patterns
* Client-Side File Generation
* Vanilla JS is Still Awesome

