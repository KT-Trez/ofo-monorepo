import { sql } from 'drizzle-orm';
import { check, index, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { boolean } from './boolean.fragment.ts';
import { isBoolean, isOneOf, isTrimmed, unsafeSqlText } from './common.check.ts';
import { CoverKind } from './common.constants.ts';
import { timestamps } from './timestamps.fragment.ts';
import { track } from './track.entity.ts';
import { uid } from './uid.fragment.ts';

export const playlist = sqliteTable(
  'playlist',
  // oxlint-disable sort-keys
  {
    uid: uid('uid').primaryKey(),
    ...timestamps(),
    coverHash: text('cover_hash'),
    coverKind: text('cover_kind', { enum: [CoverKind.Custom, CoverKind.None] })
      .notNull()
      .default(CoverKind.None),
    isSyncEnabled: boolean('is_sync_enabled').notNull().default(false),
    title: text('title').notNull(),
  },
  table => [
    check(
      'playlist_cover_hash_check',
      sql`(${table.coverKind} = ${unsafeSqlText(CoverKind.None)}) = (${table.coverHash} IS NULL)`,
    ),
    check('playlist_cover_kind_check', isOneOf(table.coverKind)),
    check('playlist_is_sync_enabled_check', isBoolean(table.isSyncEnabled)),
    check('playlist_title_check', isTrimmed(table.title)),
  ],
);

export const playlistTrack = sqliteTable(
  'playlist_track',
  // oxlint-disable sort-keys
  {
    playlistUid: uid('playlist_uid')
      .notNull()
      .references(() => playlist.uid, { onDelete: 'cascade' }),
    sortKey: text('sort_key').notNull(),
    trackUid: uid('track_uid')
      .notNull()
      .references(() => track.uid, { onDelete: 'cascade' }),
  },
  table => [
    check('playlist_track_sort_key_check', sql`${table.sortKey} <> ''`),
    index('playlist_track_order_index').on(table.playlistUid, table.sortKey, table.trackUid),
    index('playlist_track_track_uid_index').on(table.trackUid),
    primaryKey({ columns: [table.playlistUid, table.trackUid] }),
  ],
);

export type Playlist = typeof playlist.$inferSelect;
export type PlaylistInsert = typeof playlist.$inferInsert;
export type PlaylistTrackRelation = typeof playlistTrack.$inferSelect;
export type PlaylistTrackRelationInsert = typeof playlistTrack.$inferInsert;
