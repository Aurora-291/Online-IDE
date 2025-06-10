let currentCode = '';
let lastActiveTab = 'html';

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
    } catch (error) {
        console.error('Error running code:', error);
    }
}

function clearCode() {
    const activeEditor = document.querySelector('.editor.active textarea');
    if (activeEditor) {
        activeEditor.value = '';
        runCode();
    }
}

function openInNewTab() {
    const newTab = window.open();
    newTab.document.write(currentCode);
    newTab.document.close();
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