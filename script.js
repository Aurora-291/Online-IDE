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

document.addEventListener('DOMContentLoaded', () => {
    setupEditorListeners();
    loadDefaultCode();
    runCode();
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

function runCode() {
    const htmlCode = document.getElementById('html-code').value;
    const cssCode = document.getElementById('css-code').value;
    const jsCode = document.getElementById('js-code').value;

    const combinedCode = htmlCode.replace('</head>', 
        `<style>${cssCode}</style></head>`).replace('</body>', 
        `<script>${jsCode}</script></body>`);

    currentCode = combinedCode;
    
    const iframe = document.getElementById('output-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    iframeDoc.open();
    iframeDoc.write(combinedCode);
    iframeDoc.close();
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