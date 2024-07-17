import { ipcRenderer, contextBridge } from 'electron';
import { createIpcClient } from 'typed-electron-ipc';
import { SerializedTransfer } from '@shared/types/transfers';

import { Router } from '@main/ipc';

export const ipcInvoke = createIpcClient<Router>();

export const onTransferUpdate = (
  callback: (transfer: SerializedTransfer) => void, // eslint-disable-line
) => {
  ipcRenderer.on('/transfers/update', (_event, transfer) => callback(transfer));
};

export const onTransferRemove = (
  callback: (transferId: string) => void, // eslint-disable-line
) => {
  ipcRenderer.on('/transfers/remove', (_event, transferId) =>
    callback(transferId),
  );
};

contextBridge.exposeInMainWorld('ipcInvoke', ipcInvoke);
contextBridge.exposeInMainWorld('onTransferUpdate', onTransferUpdate);
contextBridge.exposeInMainWorld('onTransferRemove', onTransferRemove);
