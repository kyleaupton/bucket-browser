import { createIpcHandlers } from 'typed-electron-ipc';
import { eq } from 'drizzle-orm';
import Connection from '@main/connections/Connection';
import {
  getConnection,
  getConnections,
  addConnection,
  removeConnection,
} from '@main/connections';
import { setPassword, deletePassword } from '@main/passwords';
import db, { connections } from '@main/db';
import {
  ConnectionId,
  NewPersistedConnection,
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

    const newConnection: NewPersistedConnection = {
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

  '/connections/remove': async (event, connectionId: ConnectionId) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    await deletePassword(connection.name);
    await db.delete(connections).where(eq(connections.id, connectionId));
    removeConnection(connectionId);
  },

  '/connections/list-buckets': async (event, connectionId: ConnectionId) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    return connection.listBuckets();
  },

  '/connections/list-objects': async (
    event,
    connectionId: ConnectionId,
    input: ListObjectsV2CommandInput,
  ) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    return connection.listObjects(input);
  },
});
