import { check, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { isNullSynced, isOneOf, isTrimmed } from './common.check.ts';
import { SOURCES } from './common.constants.ts';
import { timestamps } from './timestamps.fragment.ts';
import { uid } from './uid.fragment.ts';

export const artist = sqliteTable(
  'artist',
  // oxlint-disable sort-keys
  {
    uid: uid('uid').primaryKey(),
    ...timestamps(),
    name: text('name').notNull(),
    source: text('source', { enum: SOURCES }).notNull(),
    sourceId: text('source_id').notNull(),
  },
  table => [
    check('artist_name_check', isTrimmed(table.name)),
    check('artist_source_check', isOneOf(table.source)),
    check('artist_source_id_check', isNullSynced(table.source, table.sourceId)),
    check('artist_source_id_text_check', isTrimmed(table.sourceId)),
    unique('artist_source_unique').on(table.source, table.sourceId),
  ],
);

export type Artist = typeof artist.$inferSelect;
export type ArtistInsert = typeof artist.$inferInsert;
