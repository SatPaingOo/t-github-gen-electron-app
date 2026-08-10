/**
 * Preload — secure bridge between the React renderer and the Electron main process.
 * contextIsolation is enabled, so the renderer only sees what is exposed here.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tgen', {
  // Read the branded config that lives next to the packaged app.
  getConfig: () => ipcRenderer.invoke('tgen:get-config'),
  // Tell the main process the renderer read the config (window title etc.).
  configLoaded: (cfg) => ipcRenderer.send('tgen:config-loaded', cfg),
});
