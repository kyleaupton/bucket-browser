import { Selectable } from 'kysely';
import { ConnectionTable } from '@main/db';

/** Type of connection that is stored in db */
export type PersistedConnection = Selectable<ConnectionTable>;

/** Type of a connection's ID */
export type ConnectionId = PersistedConnection['id'];

/** Type of what a database intert needs for a new connection */
export type NewPersistedConnection = Omit<PersistedConnection, 'id'>;

/** Type the renderer should pass to main to create a new connection */
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
