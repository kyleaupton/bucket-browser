import { dialog, BrowserWindow } from 'electron';
import { ipcHandle } from 'typed-electron-ipc';
import { showMessageChannel } from '@shared/ipc/dialog';

export const registerDialogIpc = () => {
  ipcHandle(showMessageChannel, async (event, options) => {
    const window = BrowserWindow.fromWebContents(event.sender) || undefined;

    if (window) {
      return dialog.showMessageBox(window, options);
    }

    return dialog.showMessageBox(options);
  });
};
