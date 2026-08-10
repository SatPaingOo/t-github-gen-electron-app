/**
 * Preload — secure bridge between the React renderer and the Electron main process.
 * contextIsolation is enabled, so the renderer only sees what is exposed here.
 *
 * `db` routes CRUD to better-sqlite3 in the main process (synchronous IPC) —
 * the renderer's DbAdapter contract stays synchronous, same as RN.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('tgen', {
  db: {
    call(op, args = []) {
      const result = ipcRenderer.sendSync('tgen:db', { op, args });
      if (result && result.error) {
        throw new Error(result.error);
      }
      return result ? result.data : undefined;
    },
  },
});
