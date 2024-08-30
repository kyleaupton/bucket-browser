import path from 'node:path';
import { app } from 'electron';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database(path.join(app.getPath('userData'), 'db.sqlite3'));
const db = drizzle(sqlite);

export default db;
export * from './schema';
