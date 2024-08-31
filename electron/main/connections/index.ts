import db from '@main/db';
import { ConnectionId, SerializedConnection } from '@shared/types/connections';
import Connection from './Connection';

const connections: Record<ConnectionId, Connection> = {};

export const initializeConnections = async (): Promise<void> => {
  const persisted = await db.selectFrom('connection').selectAll().execute();
  for (const connection of persisted) {
    const conn = new Connection(connection);
    addConnection(conn);
    conn.initialize();
  }
};

export const getConnections = (): SerializedConnection[] => {
  return Object.values(connections).map((connection) => connection.serialize());
};

export const getConnection = (id: ConnectionId): Connection | undefined => {
  return connections[id];
};

export const addConnection = (connection: Connection): void => {
  connections[connection.id] = connection;
};

export const removeConnection = (id: ConnectionId): void => {
  delete connections[id];
};
