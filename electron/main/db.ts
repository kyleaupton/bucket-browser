import { app } from 'electron';
import path from 'path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import { PersistedConnection } from '@shared/types/connections';

export type Data = {
  connections: PersistedConnection[];
};

const defaults: Data = {
  connections: [],
};

const dbPath = path.join(app.getPath('userData'), 'db.json');

const adapter = new JSONFile<Data>(dbPath);
const db = new Low<Data>(adapter, defaults);

await db.read();

export default db;
