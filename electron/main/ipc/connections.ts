import { ipcHandle, throwIpcError } from 'typed-electron-ipc';
import {
  getConnectionsChannel,
  listBucketsChannel,
} from '@shared/ipc/connections';
import { getConnections, getConnection } from '@main/connections';

export const registerConnectionsIpc = () => {
  ipcHandle(getConnectionsChannel, async () => {
    return getConnections();
  });

  ipcHandle(listBucketsChannel, async (event, connectionId) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      return throwIpcError('Connection not found');
    }

    return connection.listBuckets();
  });
};
