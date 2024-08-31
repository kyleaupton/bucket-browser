import path from 'node:path';
import url from 'node:url';
import { app } from 'electron';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const sqlite = new Database(path.join(app.getPath('userData'), 'db.sqlite3'));
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: path.join(__dirname, 'drizzle') });

export default db;
export * from './schema';
