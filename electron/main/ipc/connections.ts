import { ipcHandle } from 'typed-electron-ipc';
import { getConnectionsChannel } from '@shared/ipc/connections';
import { getConnections } from '@main/connections';

export const registerConnectionsIpc = () => {
  ipcHandle(getConnectionsChannel, async () => {
    return getConnections();
  });
};
