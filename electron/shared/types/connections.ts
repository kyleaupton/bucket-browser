import { connections } from '@main/db';

/** Type that get's stored in the database to represent a connection */
export type PersistedConnection = typeof connections.$inferSelect;

/** Type of a connections ID */
export type ConnectionId = PersistedConnection['id'];

/** Type of what a database intert needs for a new connection */
export type NewPersistedConnection = Omit<
  typeof connections.$inferInsert,
  'id'
>;

/** Type that the renderer should pass to main to create a new connection */
export type NewconnectionWithSecret = NewPersistedConnection & {
  secretAccessKey: string;
};

/** Type that get's passed into `new Connection`'s constructor */
export type Connection = PersistedConnection & {
  secretAccessKey: string;
};

/** Type of what a connection looks like when serialized and sent to the renderer process */
export type SerializedConnection = PersistedConnection & {
  secretAccessKey: string | null;
  error: string | undefined;
};
