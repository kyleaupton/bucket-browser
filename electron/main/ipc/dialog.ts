import { dialog, BrowserWindow } from 'electron';
import { createIpcHandlers } from 'typed-electron-ipc';

export const dialogIpc = createIpcHandlers({
  '/dialog/showMessageBox': async (event, options) => {
    const window = BrowserWindow.fromWebContents(event.sender) || undefined;

    if (window) {
      return dialog.showMessageBox(window, options);
    }

    return dialog.showMessageBox(options);
  },
});
