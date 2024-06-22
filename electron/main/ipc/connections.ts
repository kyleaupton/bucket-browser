import { registerIpcChannel } from 'typed-electron-ipc/dist/main';
import { getConnectionsChannel } from '@shared/ipc/connections';
import db from '@main/db';

export const registerConnectionsIpc = () => {
  registerIpcChannel(getConnectionsChannel, async () => {
    return db.data.connections;
  });
};
