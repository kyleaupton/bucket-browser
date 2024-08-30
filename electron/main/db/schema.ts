import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const connections = sqliteTable('connections', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  accessKeyId: text('access_key_id').notNull(),

  // Config
  region: text('region').notNull(),
  endpoint: text('endpoint').notNull(),
  forcePathStyle: integer('force_path_style', { mode: 'boolean' }).notNull(),
});
