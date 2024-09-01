import { BrowserWindow } from 'electron';
import { createIpcHandlers } from 'typed-electron-ipc';

export const windowIpc = createIpcHandlers({
  '/window/close': async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.close();
  },

  '/window/min': async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.minimize();
  },

  '/window/max': async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.maximize();
  },

  '/window/restore': async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.restore();
  },
});
