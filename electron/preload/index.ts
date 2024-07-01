import { ipcRenderer, contextBridge } from 'electron';
import { ipcInvoke, IpcChannel } from 'typed-electron-ipc';
import { SerializedTransfer } from '@shared/types/transfers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _ipcInvoke = async <P extends any[], R>(
  channel: IpcChannel<P, R>,
  ...args: P
): Promise<R> => {
  return ipcInvoke(channel, ...args);
};

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

contextBridge.exposeInMainWorld('ipcInvoke', _ipcInvoke);
contextBridge.exposeInMainWorld('onTransferUpdate', onTransferUpdate);
contextBridge.exposeInMainWorld('onTransferRemove', onTransferRemove);
