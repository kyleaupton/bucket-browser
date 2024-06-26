import { ipcHandle } from 'typed-electron-ipc';
import { getConnectionsChannel } from '@shared/ipc/connections';
import db from '@main/db';

export const registerConnectionsIpc = () => {
  ipcHandle(getConnectionsChannel, async () => {
    return db.data.connections;
  });
};
