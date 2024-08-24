import keytar from 'keytar';
import { createIpcHandlers } from 'typed-electron-ipc';
import Connection from '@main/connections/Connection';
import {
  getConnection,
  getConnections,
  addConnection,
  removeConnection,
} from '@main/connections';
import db from '@main/db';
import { PersistedConnection, NewConnection } from '@shared/types/connections';
import { ListObjectsV2CommandInput } from '@aws-sdk/client-s3';

export const connectionsIpc = createIpcHandlers({
  '/connections/get': async () => {
    return getConnections();
  },

  '/connections/add': async (event, connection: NewConnection) => {
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
  },

  '/connections/edit': async (event, connection: NewConnection) => {
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
  },

  '/connections/remove': async (event, connectionId: string) => {
    await keytar.deletePassword('bucket-browser', connectionId);

    removeConnection(connectionId);

    await db.update((data) => {
      data.connections = data.connections.filter(
        (conn) => conn.id !== connectionId,
      );
    });
  },

  '/connections/list-buckets': async (event, connectionId: string) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    return connection.listBuckets();
  },

  '/connections/list-objects': async (
    event,
    connectionId: string,
    input: ListObjectsV2CommandInput,
  ) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    return connection.listObjects(input);
  },
});
