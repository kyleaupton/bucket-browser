import db from '@main/db';
import Connection from './Connection';

const connections = new Map<string, Connection>();

export const initializeConnections = () => {
  const persisted = db.data.connections;
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

export const getConnection = (id: string) => {
  return connections.get(id);
};

export const addConnection = (connection: Connection) => {
  connections.set(connection.id, connection);
};

export const removeConnection = (id: string) => {
  connections.delete(id);
};
