import { createIpcHandlers } from 'typed-electron-ipc';
import Connection from '@main/connections/Connection';
import {
  getConnection,
  getConnections,
  addConnection,
  removeConnection,
} from '@main/connections';
import { setPassword, deletePassword } from '@main/passwords';
import db from '@main/db';
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
    const { insertId } = await db
      .insertInto('connection')
      .values(newConnection)
      .executeTakeFirst();

    if (!insertId) {
      throw new Error('Failed to insert connection into database');
    }

    // Cast the insertId to a number
    // If insertId is a bigint, the user is doing too much
    const id = Number(insertId);

    const persisted = await db
      .selectFrom('connection')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();

    const conn = new Connection(persisted);
    await conn.initialize();
    addConnection(conn);
  },

  '/connections/edit': async (
    event,
    connectionId: ConnectionId,
    connection: NewconnectionWithSecret,
  ) => {
    await setPassword(connection.name, connection.secretAccessKey);
    removeConnection(connectionId);

    const newConnection: NewPersistedConnection = {
      name: connection.name,
      region: connection.region,
      endpoint: connection.endpoint,
      forcePathStyle: connection.forcePathStyle,
      accessKeyId: connection.accessKeyId,
    };

    await db
      .updateTable('connection')
      .set(newConnection)
      .where('id', '=', connectionId)
      .execute();

    const persisted = await db
      .selectFrom('connection')
      .selectAll()
      .where('id', '=', connectionId)
      .executeTakeFirstOrThrow();

    const conn = new Connection(persisted);
    await conn.initialize();
    addConnection(conn);
  },

  '/connections/remove': async (event, connectionId: ConnectionId) => {
    const connection = getConnection(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    await deletePassword(connection.name);
    await db.deleteFrom('connection').where('id', '=', connectionId).execute();
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
