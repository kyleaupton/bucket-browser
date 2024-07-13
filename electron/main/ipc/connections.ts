import keytar from 'keytar';
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
  getConnections,
  addConnection,
  removeConnection,
} from '@main/connections';
import db from '@main/db';
import { PersistedConnection } from '@shared/types/connections';

export const registerConnectionsIpc = () => {
  ipcHandle(getConnectionsChannel, async () => {
    return getConnections();
  });

  ipcHandle(addConnectionChannel, async (event, connection) => {
    await keytar.setPassword(
      'bucket-browser',
      connection.id,
      connection.secretAccessKey,
    );

    const persisted: PersistedConnection = {
      nickname: connection.nickname,
      id: connection.id,
      config: connection.config,
      accessKeyId: connection.accessKeyId,
    };

    const conn = new Connection(persisted);
    await conn.initialize();
    addConnection(conn);

    await db.update((data) => {
      const index = data.connections.findIndex((c) => c.id === persisted.id);

      if (index === -1) {
        data.connections.push(persisted);
      }
    });
  });

  ipcHandle(editConnectionChannel, async (event, connection) => {
    // TODO: Edit in a way that doesn't just remove/add a new connection
    await keytar.setPassword(
      'bucket-browser',
      connection.id,
      connection.secretAccessKey,
    );

    removeConnection(connection.id);

    const conn = new Connection(connection);
    await conn.initialize();
    addConnection(conn);

    await db.update((data) => {
      const index = data.connections.findIndex((c) => c.id === connection.id);

      if (index !== -1) {
        data.connections[index] = connection;
      }
    });
  });

  ipcHandle(removeConnectionChannel, async (event, connectionId) => {
    await keytar.deletePassword('bucket-browser', connectionId);

    removeConnection(connectionId);

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
