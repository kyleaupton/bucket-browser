import { ipcHandle, throwIpcError } from 'typed-electron-ipc';
import {
  getConnectionsChannel,
  addConnectionChannel,
  editConnectionChannel,
  listBucketsChannel,
} from '@shared/ipc/connections';
import Connection from '@main/connections/Connection';
import {
  getConnections,
  getConnection,
  addConnection,
  removeConnection,
} from '@main/connections';
import db from '@main/db';

export const registerConnectionsIpc = () => {
  ipcHandle(getConnectionsChannel, async () => {
    return getConnections();
  });

  ipcHandle(addConnectionChannel, async (event, connection) => {
    addConnection(new Connection(connection));

    await db.update((data) => {
      const index = data.connections.findIndex(
        (conn) => conn.id === connection.id,
      );

      if (index === -1) {
        data.connections.push(connection);
      }
    });
  });

  ipcHandle(editConnectionChannel, async (event, connection) => {
    removeConnection(connection.id);
    addConnection(new Connection(connection));

    // Update db entry
    await db.update((data) => {
      const index = data.connections.findIndex(
        (conn) => conn.id === connection.id,
      );

      if (index !== -1) {
        data.connections[index] = connection;
      }
    });
  });

  ipcHandle(listBucketsChannel, async (event, connectionId) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      return throwIpcError('Connection not found');
    }

    return connection.listBuckets();
  });
};
