/**
 * TGen Electron template — main process.
 * - loads app branding from app.config.json (window title / icon)
 * - owns the SQLite database (better-sqlite3) and serves it to the renderer
 *   through synchronous IPC (tgen:db) — the renderer's shared DbAdapter
 *   contract stays synchronous, same as the RN side.
 */

const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { createService } = require('./db');

function loadConfig() {
  const configPath = path.join(app.getAppPath(), 'app.config.json');
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.warn(
      '[main] failed to read app.config.json, using defaults:',
      err.message,
    );
    return {
      appName: 'TGen App',
      primaryColor: '#3B82F6',
      supportEmail: 'support@example.com',
    };
  }
}

const config = loadConfig();
let dbService = null;
let mainWindow = null;

function registerDbHandlers() {
  dbService = createService(app.getPath('userData'));

  // Synchronous IPC so the renderer's DbAdapter contract stays synchronous.
  ipcMain.on('tgen:db', (event, payload) => {
    const { op, args = [] } = payload || {};
    if (!dbService || typeof dbService[op] !== 'function') {
      event.returnValue = { error: `unknown db op: ${op}` };
      return;
    }
    try {
      event.returnValue = { data: dbService[op](...args) };
    } catch (err) {
      event.returnValue = { error: err.message };
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 720,
    minWidth: 640,
    minHeight: 480,
    title: config.appName,
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    backgroundColor: '#F1F5F9',
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
    // app.asar/app/dist/index.html — vite builds into <repo>/app/dist
    mainWindow.loadFile(
      path.join(__dirname, '..', 'app', 'dist', 'index.html'),
    );
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  registerDbHandlers();
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
