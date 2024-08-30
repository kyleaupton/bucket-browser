import { connections } from '@main/db';

export type PersistedConnection = typeof connections.$inferSelect;
export type NewConnection = Omit<typeof connections.$inferInsert, 'id'>;
export type NewconnectionWithSecret = NewConnection & {
  secretAccessKey: string;
};

export type Connection = PersistedConnection & {
  secretAccessKey: string;
};

export type SerializedConnection = PersistedConnection & {
  secretAccessKey: string | null;
  error: string | undefined;
};
