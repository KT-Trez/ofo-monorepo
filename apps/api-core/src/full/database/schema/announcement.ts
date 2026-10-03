import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { databaseBaseColumns } from '../database.columns.js';

export const announcementTable = pgTable('announcement', {
  message: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  uid: uuid().primaryKey(),
  ...databaseBaseColumns,
});
