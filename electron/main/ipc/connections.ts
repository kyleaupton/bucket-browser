import { ipcHandle, throwIpcError } from 'typed-electron-ipc';
import {
  getConnectionsChannel,
  addConnectionChannel,
  editConnectionChannel,
  removeConnectionChannel,
  listBucketsChannel,
  listObjectsChannel,
} from '@shared/ipc/connections';
import Connection from '@main/connections/Connection';
import {
  getConnection,
  addConnection,
  removeConnection,
} from '@main/connections';
import db from '@main/db';

export const registerConnectionsIpc = () => {
  ipcHandle(getConnectionsChannel, async () => {
    return db.data.connections;
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

  ipcHandle(removeConnectionChannel, async (event, connectionId) => {
    removeConnection(connectionId);

    // Remove db entry
    await db.update((data) => {
      data.connections = data.connections.filter(
        (conn) => conn.id !== connectionId,
      );
    });
  });

  ipcHandle(listBucketsChannel, async (event, connectionId) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      return throwIpcError('Connection not found');
    }

    return connection.listBuckets();
  });

  ipcHandle(listObjectsChannel, async (event, connectionId, input) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      return throwIpcError('Connection not found');
    }

    return connection.listObjects(input);
  });
};
