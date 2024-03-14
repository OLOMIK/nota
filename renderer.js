const { ipcRenderer, app } = require('electron');
function wypierdol(){ // jakby ktoś był mega divolperem to moze sobie wyczyścić przez konsole
    document.getElementById('dupa').value = "";
}
// początek licznika linii
function updateLineNumbers(textarea, lineNumbers) {
    // Ustawienie początkowego numeru linii na 1
    let lineCount = 1;

    // Obliczanie ilości linii w edytorze
    const lines = textarea.value.split('\n');
    lineCount = lines.length;

    // Utworzenie numerów linii
    const lineNumberHtml = lines.map((_, index) => `${index + 1}<br>`).join('');

    // Uaktualnienie licznika linii
    lineNumbers.innerHTML = lineNumberHtml;

    // Synchronizacja przewijania licznika linii z edytorem tekstu
    lineNumbers.scrollTop = textarea.scrollTop;
}

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('.main-field');
    const lineNumbers = document.querySelector('.line-numbers');

    // Inicjalizacja licznika linii
    updateLineNumbers(textarea, lineNumbers);

    // Aktualizacja licznika linii podczas wprowadzania zmian
    textarea.addEventListener('input', () => {
        updateLineNumbers(textarea, lineNumbers);
    });

    // Synchronizacja przewijania licznika linii z edytorem
    textarea.addEventListener('scroll', () => {
        lineNumbers.scrollTop = textarea.scrollTop;
    });
});
// koniec licznika linii

// funkcje, odbieranie z index.js
ipcRenderer.on('file-data', (event, data) => {
    document.getElementById('dupa').value = data;
});
ipcRenderer.on('usunburdel', (event) => {
    document.getElementById('dupa').value = "";
});
ipcRenderer.on('szatdawn', (event) => {
    app.quit();
});
ipcRenderer.on('trigger-file-save', () => {
    const content = document.getElementById('dupa').value;
    ipcRenderer.send('save-file-dialog', content);
});
ipcRenderer.on('godzina', (event) => {
    const now = new Date();
    const formattedDate = now.getDate().toString().padStart(2, '0') + '-' +
                          (now.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                          now.getFullYear();
    const formattedTime = now.getHours().toString().padStart(2, '0') + ':' +
                          now.getMinutes().toString().padStart(2, '0') + ':' +
                          now.getSeconds().toString().padStart(2, '0');
    // nie rozumiem ale buja XD
    document.getElementById('dupa').value = `${formattedDate} ${formattedTime}`;
});
ipcRenderer.on('tts', () => {
    const content = document.getElementById('dupa').value;
    var msg = new SpeechSynthesisUtterance();
    msg.text = content;
    window.speechSynthesis.speak(msg);

});
// koniec funkcji
/*
// początek języków
ipcRenderer.on('html', (event) => {
    document.getElementById('dupa').value = "<!Doctype html>\n<html>\n<head>\n<body>\n</body>\n</html> ";
});
ipcRenderer.on('css', (event) => {
    document.getElementById('dupa').value = "";
});
ipcRenderer.on('js', (event) => {
    document.getElementById('dupa').value = "";
});
ipcRenderer.on('clang', (event) => {
    document.getElementById('dupa').value = "";
});
ipcRenderer.on('cpp', (event) => {
    document.getElementById('dupa').value = "";
});
ipcRenderer.on('cs', (event) => {
    document.getElementById('dupa').value = "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Text;\nnamespace Program\n{\nclass Program\n{\nstatic void Main(string[] args)\n{\n}\n}\n}\n ";
});
ipcRenderer.on('vb', (event) => {
    document.getElementById('dupa').value = "";
});
ipcRenderer.on('python', (event) => {
    document.getElementById('dupa').value = "";
});
ipcRenderer.on('lua', (event) => {
    document.getElementById('dupa').value = "";
});
ipcRenderer.on('java', (event) => {
    document.getElementById('dupa').value = "";
});
// koniec języków
*/
