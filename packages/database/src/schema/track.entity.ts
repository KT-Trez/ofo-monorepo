import { sql } from 'drizzle-orm';
import { check, index, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { artist } from './artist.entity.ts';
import { isOneOf, isTrimmed, unsafeSqlText } from './common.check.ts';
import { COVER_KINDS, CoverKind, SOURCES } from './common.constants.ts';
import { timestamp } from './timestamp.fragment.ts';
import { timestamps } from './timestamps.fragment.ts';
import { uid } from './uid.fragment.ts';

export const track = sqliteTable(
  'track',
  // oxlint-disable sort-keys
  {
    uid: uid('uid').primaryKey(),
    ...timestamps(),
    artistUid: uid('artist_uid').references(() => artist.uid, { onDelete: 'set null' }),
    coverHash: text('cover_hash'),
    coverKind: text('cover_kind', { enum: COVER_KINDS }).notNull().default(CoverKind.None),
    durationMs: integer('duration_ms'),
    releasedAt: timestamp('released_at'),
    source: text('source', { enum: SOURCES }).notNull(),
    sourceId: text('source_id').notNull(),
    title: text('title').notNull(),
  },
  table => [
    check(
      'track_cover_hash_check',
      sql`(${table.coverKind} = ${unsafeSqlText(CoverKind.None)}) = (${table.coverHash} IS NULL)`,
    ),
    check('track_cover_kind_check', isOneOf(table.coverKind)),
    check('track_duration_ms_check', sql`${table.durationMs} > 0`),
    check('track_source_check', isOneOf(table.source)),
    check('track_source_id_check', isTrimmed(table.sourceId)),
    check('track_title_check', isTrimmed(table.title)),
    index('track_artist_uid_index').on(table.artistUid),
    unique('track_source_unique').on(table.source, table.sourceId),
  ],
);

export type Track = typeof track.$inferSelect;
export type TrackInsert = typeof track.$inferInsert;
