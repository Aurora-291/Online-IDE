let currentCode = '';
let lastActiveTab = 'html';
let autoRunDelay = 1500;
let autoRunTimeout;
let editorHistory = {
    html: [],
    css: [],
    js: []
};
let historyPosition = {
    html: -1,
    css: -1,
    js: -1
};
let isFullscreen = false;

document.addEventListener('DOMContentLoaded', () => {
    setupEditorListeners();
    setupThemeSwitcher();
    loadSavedCode();
    runCode();
    interceptConsole();
    loadDefaultCode();
});

function loadDefaultCode() {
    const defaultHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Sample Site</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to Sample Site</h1>
        <p>Start coding your project here!</p>
        <button onclick="showMessage()">Click me!</button>
    </div>
</body>
</html>`;

    const defaultCSS = `body {
    font-family: 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 2rem;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
    padding: 0.5rem 1rem;
    background: #94A187;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: transform 0.3s ease;
}

button:hover {
    transform: translateY(-2px);
}`;

    const defaultJS = `function showMessage() {
    console.log('Button clicked!');
    alert('Hello from Sample Site!');
}`;

    document.getElementById('html-code').value = defaultHTML;
    document.getElementById('css-code').value = defaultCSS;
    document.getElementById('js-code').value = defaultJS;
    
    addToHistory(defaultHTML, 'html');
    addToHistory(defaultCSS, 'css');
    addToHistory(defaultJS, 'js');
}

function setupThemeSwitcher() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme', btn.classList.contains('dark') ? 'dark' : 'light');
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            localStorage.setItem('theme', btn.classList.contains('dark') ? 'dark' : 'light');
        });
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeBtns.forEach(btn => {
            btn.classList.toggle('active', 
                (savedTheme === 'dark' && btn.classList.contains('dark')) || 
                (savedTheme === 'light' && btn.classList.contains('light'))
            );
        });
    }
}

function switchTab(tab) {
    document.querySelectorAll('.editor').forEach(editor => {
        editor.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tabBtn => {
        tabBtn.classList.remove('active');
    });
    
    document.getElementById(`${tab}-editor`).classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tab}')"]`).classList.add('active');
    lastActiveTab = tab;
    
    const editor = document.getElementById(`${tab}-code`);
    editor.focus();
}

function addToHistory(code, type) {
    if (code === editorHistory[type][historyPosition[type]]) return;
    
    editorHistory[type] = editorHistory[type].slice(0, historyPosition[type] + 1);
    editorHistory[type].push(code);
    historyPosition[type] = editorHistory[type].length - 1;
    
    if (editorHistory[type].length > 50) {
        editorHistory[type].shift();
        historyPosition[type]--;
    }
}

function undo(type) {
    if (historyPosition[type] > 0) {
        historyPosition[type]--;
        const code = editorHistory[type][historyPosition[type]];
        document.getElementById(`${type}-code`).value = code;
        runCode();
    }
}

function redo(type) {
    if (historyPosition[type] < editorHistory[type].length - 1) {
        historyPosition[type]++;
        const code = editorHistory[type][historyPosition[type]];
        document.getElementById(`${type}-code`).value = code;
        runCode();
    }
}

function setupEditorListeners() {
    ['html', 'css', 'js'].forEach(type => {
        const editor = document.getElementById(`${type}-code`);
        
        editor.addEventListener('input', () => {
            if (autoRunTimeout) {
                clearTimeout(autoRunTimeout);
            }
            
            autoRunTimeout = setTimeout(runCode, autoRunDelay);
            addToHistory(editor.value, type);
        });
        
        editor.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    undo(type);
                } else if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
                    e.preventDefault();
                    redo(type);
                } else if (e.key === 's') {
                    e.preventDefault();
                    saveProject();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    runCode();
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
            }
        });
    });
}

function formatCode(type) {
    const editor = document.getElementById(`${type}-code`);
    let formatted = editor.value;
    
    try {
        if (type === 'js') {
            formatted = js_beautify(formatted, {
                indent_size: 4,
                space_in_empty_paren: true
            });
        } else if (type === 'html') {
            formatted = html_beautify(formatted, {
                indent_size: 4,
                max_preserve_newlines: 2
            });
        } else if (type === 'css') {
            formatted = css_beautify(formatted, {
                indent_size: 4
            });
        }
        
        editor.value = formatted;
        addToHistory(formatted, type);
        runCode();
        logToConsole('Code formatted successfully', 'success');
    } catch (error) {
        logToConsole('Error formatting code: ' + error.message, 'error');
    }
}

function runCode() {
    const htmlCode = document.getElementById('html-code').value;
    const cssCode = document.getElementById('css-code').value;
    const jsCode = document.getElementById('js-code').value;

    const combinedCode = htmlCode.replace('</head>', 
        `<style>${cssCode}</style></head>`).replace('</body>', 
        `<script>${jsCode}</script></body>`);

    currentCode = combinedCode;
    
    try {
        const iframe = document.getElementById('output-frame');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        iframeDoc.open();
        iframeDoc.write(combinedCode);
        iframeDoc.close();
        
        logToConsole('Code executed successfully', 'success');
    } catch (error) {
        logToConsole('Error running code: ' + error.message, 'error');
    }
    
    saveToLocalStorage();
}

function clearCode() {
    const activeEditor = document.querySelector('.editor.active textarea');
    if (activeEditor) {
        const type = activeEditor.id.split('-')[0];
        addToHistory('', type);
        activeEditor.value = '';
        runCode();
    }
}

function openInNewTab() {
    const newTab = window.open();
    newTab.document.write(currentCode);
    newTab.document.close();
}

function saveToLocalStorage() {
    const codeState = {
        html: document.getElementById('html-code').value,
        css: document.getElementById('css-code').value,
        js: document.getElementById('js-code').value,
        history: editorHistory,
        historyPosition: historyPosition
    };
    
    localStorage.setItem('savedCode', JSON.stringify(codeState));
}

function loadSavedCode() {
    const saved = localStorage.getItem('savedCode');
    if (saved) {
        const codeState = JSON.parse(saved);
        document.getElementById('html-code').value = codeState.html;
        document.getElementById('css-code').value = codeState.css;
        document.getElementById('js-code').value = codeState.js;
        
        if (codeState.history) {
            editorHistory = codeState.history;
            historyPosition = codeState.historyPosition;
        }
    }
}

function saveProject() {
    const projectData = {
        html: document.getElementById('html-code').value,
        css: document.getElementById('css-code').value,
        js: document.getElementById('js-code').value,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logToConsole('Project saved successfully', 'success');
}

function setPreviewMode(mode) {
    const container = document.querySelector('.preview-container');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    container.className = 'preview-container ' + mode;
    viewBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(mode)) {
            btn.classList.add('active');
        }
    });
}

function toggleFullscreen() {
    const codePanel = document.querySelector('.code-panel');
    isFullscreen = !isFullscreen;
    
    if (isFullscreen) {
        codePanel.style.position = 'fixed';
        codePanel.style.top = '0';
        codePanel.style.left = '0';
        codePanel.style.right = '0';
        codePanel.style.bottom = '0';
        codePanel.style.zIndex = '1000';
        codePanel.style.margin = '0';
        codePanel.style.borderRadius = '0';
    } else {
        codePanel.style = '';
    }
}

function interceptConsole() {
    const iframe = document.getElementById('output-frame');
    iframe.onload = () => {
        const iframeWindow = iframe.contentWindow;
        
        iframeWindow.console.log = function() {
            const args = Array.from(arguments);
            logToConsole(args.join(' '), 'log');
        };
        
        iframeWindow.console.error = function() {
            const args = Array.from(arguments);
            logToConsole(args.join(' '), 'error');
        };
        
        iframeWindow.console.warn = function() {
            const args = Array.from(arguments);
            logToConsole(args.join(' '), 'warning');
        };
    };
}

function logToConsole(message, type = 'log') {
    const consoleOutput = document.querySelector('.console-content');
    const messageElement = document.createElement('div');
    messageElement.className = `console-message ${type}`;
    messageElement.textContent = message;
    consoleOutput.appendChild(messageElement);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
    const consoleOutput = document.querySelector('.console-content');
    consoleOutput.innerHTML = '';
}