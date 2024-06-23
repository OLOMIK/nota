const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('node:path');
const fs = require('fs');

// Discord RPC start
const DiscordRPC = require('discord-rpc');
const clientId = '1192132021103898724';

DiscordRPC.register(clientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

async function setActivity() {
  if (!rpc || !app.isReady()) return;

  rpc.setActivity({
    details: "Edytuje plik",
    state: "Używając Nota 10",
    startTimestamp: new Date(),
    largeImageKey: "nota-9",
    largeImageText: "Nota 9",
    smallImageKey: "small-image-key",
    smallImageText: "Wersja klienta: 10.0.0",
    instance: false,
  });
}

rpc.on('ready', () => {
  setActivity();
});

rpc.login({ clientId }).catch(console.error);
// Discord RPC end

function createWindow() {
  var splash = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: true
  });
  splash.loadFile('assets/splashScreen.html');

  let win = new BrowserWindow({
    width: 1000,
    height: 900,
    show: false,
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
        {
          label: 'Otwórz', accelerator: 'CmdOrCtrl+O', click: () => {
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
          }
        },
        {
          label: 'Zapisz', accelerator: 'CmdOrCtrl+S', click: () => {
            win.webContents.send('trigger-file-save');
          }
        },
        {
          label: 'Wyczyść', accelerator: 'CmdOrCtrl+G', click: () => { win.webContents.send('usunburdel'); }
        },
        { type: 'separator' },
        {
          label: 'Zamknij', accelerator: 'Alt+F4', click: () => { win.webContents.send('szatdawn'); }
        }
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
        { label: 'Wstaw Datę I Godzinę', click: () => { win.webContents.send("godzina") } },
        { label: 'Tekst Na Mowę', click: () => { win.webContents.send("tts") } },
        {
          label: 'Podgląd HTML', click: () => {
            dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'HTML Files', extensions: ['html', 'htm'] }] }).then(result => {
              if (!result.canceled && result.filePaths.length > 0) {
                const htmlFilePath = result.filePaths[0];
                let htmlWin = new BrowserWindow({
                  width: 800,
                  height: 600,
                  autoHideMenuBar: true,
                  webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                  },
                  icon: path.join(__dirname, 'assets/nota-9.png')
                });
                htmlWin.loadFile(htmlFilePath);
                htmlWin.setMenu(null);
                htmlWin.setTitle("Nota 10 - Podgląd HTML")
              }
            }).catch(err => {
              console.error(err);
            });
          }
        },
        { type: 'separator' },
        { label: 'ChatGPT', click: () => { win.loadURL('https://chat.openai.com/'); } },
        { label: 'Okno notatnika', click: () => { win.loadFile('main-view.html'); } }
      ]
    },
    {
      label: 'Funkcje Deweloperskie',
      submenu: [
        { label: 'Przeładuj', role: 'reload' },
        { label: 'Przełącz Chromium DevTools', role: 'toggledevtools' }
      ]
    }
  ]);
  win.setMenu(menu);

  let splashShown = false;

  splash.once('show', () => {
    splashShown = true;
  });

  win.once('ready-to-show', () => {
    setTimeout(() => {
      if (splash && !splash.isDestroyed()) {
        splash.close();
      }
      win.maximize();
      win.show();
      win.focus();
    }, 3000);
  });

  setTimeout(() => {
    if (!splashShown) {
      splash.show();
    }
  }, 100);
}

app.on('ready', () => {
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
    title: 'Nota - Zapisywanie Pliku.'
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
  dialog.showMessageBox(null, options);
}
