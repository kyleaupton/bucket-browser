import { createIpcHandlers } from 'typed-electron-ipc';
import { eq } from 'drizzle-orm';
import Connection from '@main/connections/Connection';
import {
  getConnection,
  getConnections,
  addConnection,
  removeConnection,
} from '@main/connections';
import { getPassword, setPassword, deletePassword } from '@main/passwords';
import db, { connections } from '@main/db';
import {
  PersistedConnection,
  Connection,
  NewConnection,
  NewconnectionWithSecret,
} from '@shared/types/connections';
import { ListObjectsV2CommandInput } from '@aws-sdk/client-s3';

export const connectionsIpc = createIpcHandlers({
  '/connections/get': async () => {
    return getConnections();
  },

  '/connections/add': async (event, connection: NewconnectionWithSecret) => {
    // Add the secret access key to the keychain
    await setPassword(connection.name, connection.secretAccessKey);

    const newConnection: NewConnection = {
      name: connection.name,
      region: connection.region,
      endpoint: connection.endpoint,
      forcePathStyle: connection.forcePathStyle,
      accessKeyId: connection.accessKeyId,
    };

    // Add the connection to the database
    const { lastInsertRowid } = await db
      .insert(connections)
      .values(newConnection);

    if (typeof lastInsertRowid !== 'number') {
      throw new Error(
        "Newly added connection ID is not a number, it's a bigint",
      );
    }

    // Get the connection we just added
    const persisted = await db
      .select()
      .from(connections)
      .where(eq(connections.id, lastInsertRowid));

    if (persisted.length !== 1) {
      throw new Error('Duplicate connection ID');
    }

    const conn = new Connection(persisted[0]);
    await conn.initialize();
    addConnection(conn);
  },

  '/connections/edit': async (event, connection: NewconnectionWithSecret) => {
    // TODO: Edit in a way that doesn't just remove/add a new connection
    await setPassword(connection.name, connection.secretAccessKey);

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
