const { app, BrowserWindow, Menu, dialog, ipcMain  } = require('electron');
const path = require('node:path');
var fs = require('fs'); 
//discord rpc początek
const DiscordRPC = require('discord-rpc');
const clientId = '1192132021103898724';

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setActivity() {
  if (!rpc || !app.isReady()) return;


  rpc.setActivity({
    details: "Edytuje plik",
    state: "Używając Nota 9",
    startTimestamp: new Date(),
    largeImageKey: "nota-9", 
    largeImageText: "Nota 9",
    smallImageKey: "small-image-key",
    smallImageText: "Wersja klienta: 9.0.0    ",
    instance: false,
  });
}

rpc.on('ready', () => {
  setActivity();
});

rpc.login({ clientId }).catch(console.error);   
// discord rpc koniec
function createWindow() {

    let win = new BrowserWindow({
        width: 1000,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'assets/nota-9.png')
    });

    win.loadFile('main-view.html');

    const menu = Menu.buildFromTemplate([
        {
            label: 'Plik',
            submenu: [
                { label: 'Otwórz', accelerator: 'CmdOrCtrl+O', click: () => { 
                    dialog.showOpenDialog({ properties: ['openFile'] }).then(result => {
                        if (!result.canceled) {
                            fs.readFile(result.filePaths[0], 'utf-8', (err, data) => {
                                if (err) {
                                    console.error('Error reading file:', err);
                                    return;
                                }
                                win.webContents.send('file-data', data);
                            });
                        }
                    }).catch(err => {
                        console.error(err);
                    });
                } },
                { label: 'Zapisz', accelerator: 'CmdOrCtrl+S', click: () => {
                    win.webContents.send('trigger-file-save');
                 } },
                { label: 'Wyczyść',accelerator: 'CmdOrCtrl+G', click: () => {win.webContents.send('usunburdel'); } },
                { type: 'separator' },
                { label: 'Zamknij',accelerator: 'Alt+F4', click: () => { win.webContents.send('szatdawn');} }
            ]
        },
        {
            label: 'Edycja',
            submenu: [
                { label: 'Cofnij', role: 'undo' },
                { label: 'Cofnij Cofnięcie', role: 'redo' },
                { type: 'separator' },
                { label: 'Wytnij', role: 'cut' },
                { label: 'Kopiuj', role: 'copy' },
                { label: 'Wklej', role: 'paste' }
            ]
        },
        {
            label: 'Funkcje',
            submenu: [
                { label: 'Wstaw Datę I Godzinę', click: () => {win.webContents.send("godzina")}},
                { label: 'Tekst Na Mowę', click: () => {win.webContents.send("tts")}},
                { type: 'separator' },
                { label: 'ChatGPT', click: () => {win.loadURL('https://chat.openai.com/');}},
                { label: 'Okno notatnika', click: () => {win.loadFile('main-view.html');}}
               

            ]
        },
       /*
        {
            label: 'Język Programowania',
            submenu: [
                { label: 'HTML', click: () => { niemafunkcji()}},
                { label: 'CSS', click: () => { niemafunkcji()}},
                { label: 'JavaScript', click: () => { niemafunkcji()} },
                { label: 'C', click: () => {niemafunkcji()}},
                { label: 'C++', click: () => { niemafunkcji()}},
                { label: 'C#', click: () => { niemafunkcji()}},
                { label: 'Visual Basic', click: () => { niemafunkcji()}},
                { label: 'Python', click: () => { niemafunkcji()} },
                { label: 'Lua', click: () => { niemafunkcji()}},
                { label: 'Java', click: () => { niemafunkcji()}}
               /*
               nie mam czasu na to w wersji 9.0, pojawi się w 9.1
                { label: 'HTML', click: () => { win.webContents.send('html');}},
                { label: 'CSS', click: () => { win.webContents.send('css');}},
                { label: 'JavaScript', click: () => { win.webContents.send('js');} },
                { label: 'C', click: () => { win.webContents.send('clang');}},
                { label: 'C++', click: () => { win.webContents.send('cpp');}},
                { label: 'C#', click: () => { win.webContents.send('cs');}},
                { label: 'Visual Basic', click: () => { win.webContents.send('vb');}},
                { label: 'Python', click: () => { win.webContents.send('python');} },
                { label: 'Lua', click: () => { win.webContents.send('lua');}},
                { label: 'Java', click: () => { win.webContents.send('java');}}
                ta funkcja się pojawi w nota 9.1 lub nota 9.0.2

            ]
        },
        */ 
        {
            label: 'Funkcje Deweloperskie',
            submenu: [
                { label: 'Przeładuj', role: 'reload' },
                { label: 'Przełącz Chromium DevTools', role: 'toggledevtools' }
            ]
        }
    ]);
    win.setMenu(menu);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
ipcMain.on('save-file-dialog', (event, data) => {
    dialog.showSaveDialog({
        title: 'Nota - Zapisywanie Pliku. '

    }).then(file => {
        if (!file.canceled && file.filePath) {
            fs.writeFile(file.filePath, data, 'utf-8', (err) => {
                if (err) {
                    console.error('Error saving file:', err);
                } else {
                   
                    event.sender.send('file-saved-confirm', file.filePath);
                }
            });
        }
    }).catch(err => {
        console.error(err);
    });
});
function niemafunkcji() {
    const options = {
        type: 'info',
        buttons: ['Ok', 'Cancel'],
        defaultId: 0,
        title: 'Nota 9 - Błąd',
        message: 'Ta Funkcja Jest Niedostępna.',
        detail: 'Ta Funkcja Jest W Budowie. Za Utrudnienia Przepraszamy.',
    };
    dialog.showMessageBox(null, options)
    
}