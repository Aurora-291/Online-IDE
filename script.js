function switchTab(tab) {
    document.querySelectorAll('.editor').forEach(editor => {
        editor.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tabBtn => {
        tabBtn.classList.remove('active');
    });
    
    document.getElementById(`${tab}-editor`).classList.add('active');
    document.querySelector(`.tab[onclick="switchTab('${tab}')"]`).classList.add('active');
}