/**
 * TGen Electron template — config-driven desktop app (Windows MVP).
 * main process, built as CJS (Electron main scripts cannot use ESM import).
 */

const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

function loadConfig() {
  const configPath = path.join(app.getAppPath(), 'app.config.json');
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.warn('[main] failed to read app.config.json, using defaults:', err.message);
    return {
      appName: 'TGen App',
      primaryColor: '#3B82F6',
      supportEmail: 'support@example.com',
    };
  }
}

const config = loadConfig();

// Branding hook: called after the renderer signals it has read app.config.json.
function onRendererConfig(cfg) {
  try {
    if (cfg.appName && cfg.appName !== app.getName()) {
      app.setName(cfg.appName);
      // Windows: visible taskbar/window title
      const win = BrowserWindow.getAllWindows()[0];
      if (win) {
        win.setTitle(cfg.appName);
      }
    }
  } catch (err) {
    console.warn('[main] failed to apply renderer config:', err.message);
  }
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 720,
    minWidth: 640,
    minHeight: 480,
    title: config.appName,
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    backgroundColor: '#FFFFFF',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Open external links in the system browser instead of a new Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'app', 'dist', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // IPC bridge used by preload.js
  ipcMain.handle('tgen:get-config', () => config);
  ipcMain.on('tgen:config-loaded', (_event, cfg) => onRendererConfig(cfg));

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

// Exposed for the renderer via preload.
module.exports = {
  loadConfig,
  onRendererConfig,
};
