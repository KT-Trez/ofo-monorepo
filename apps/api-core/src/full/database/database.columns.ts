import { timestamp } from 'drizzle-orm/pg-core';

export const databaseBaseColumns = {
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
  updated_at: timestamp().defaultNow().notNull(),
};
