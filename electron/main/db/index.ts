import path from 'node:path';
import { app } from 'electron';
import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { Database } from './schema';

const dialect = new SqliteDialect({
  database: new SQLite(path.join(app.getPath('userData'), 'db.sqlite')),
});

const db = new Kysely<Database>({
  dialect,
});

await db.schema
  .createTable('connection')
  .ifNotExists()
  .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
  .addColumn('name', 'text', (col) => col.notNull())
  .addColumn('accessKeyId', 'text', (col) => col.notNull())
  .addColumn('region', 'text', (col) => col.notNull())
  .addColumn('endpoint', 'text', (col) => col.notNull())
  .addColumn('forcePathStyle', 'integer', (col) => col.notNull())
  .execute();

export default db;
export * from './schema';
