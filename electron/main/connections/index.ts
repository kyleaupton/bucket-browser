import db, { connections as table_connections } from '@main/db';
import Connection from './Connection';

const connections = new Map<number, Connection>();

export const initializeConnections = async () => {
  const persisted = await db.select().from(table_connections);
  for (const connection of persisted) {
    const conn = new Connection(connection);
    connections.set(conn.id, conn);
    conn.initialize();
  }
};

export const getConnections = () => {
  return Array.from(connections.values()).map((connection) =>
    connection.serialize(),
  );
};

export const getConnection = (id: number) => {
  return connections.get(id);
};

export const addConnection = (connection: Connection) => {
  connections.set(connection.id, connection);
};

export const removeConnection = (id: number) => {
  connections.delete(id);
};
