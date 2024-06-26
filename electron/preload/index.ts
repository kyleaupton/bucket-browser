import { contextBridge } from 'electron';
import { ipcInvoke, IpcChannel } from 'typed-electron-ipc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _ipcInvoke = async <P extends any[], R>(
  channel: IpcChannel<P, R>,
  ...args: P
): Promise<R> => {
  return ipcInvoke(channel, ...args);
};

contextBridge.exposeInMainWorld('ipcInvoke', _ipcInvoke);
