import { check, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { isOneOf } from './common.check.ts';
import { PLAYLIST_SORT_MODES, PlaylistSortMode } from './playlist-local.constants.ts';
import { playlist } from './playlist.entity.ts';
import { timestamp } from './timestamp.fragment.ts';
import { timestamps } from './timestamps.fragment.ts';
import { uid } from './uid.fragment.ts';

export const playlistLocal = sqliteTable(
  'playlist_local',
  // oxlint-disable sort-keys
  {
    ...timestamps(),
    playlistUid: uid('playlist_uid')
      .primaryKey()
      .references(() => playlist.uid, { onDelete: 'cascade' }),
    lastOpenedAt: timestamp('last_opened_at')
      .notNull()
      .$defaultFn(() => new Date()),
    sortMode: text('sort_mode', { enum: PLAYLIST_SORT_MODES })
      .notNull()
      .default(PlaylistSortMode.CustomAsc),
  },
  table => [check('playlist_local_sort_mode_check', isOneOf(table.sortMode))],
);

export type PlaylistLocal = typeof playlistLocal.$inferSelect;
export type PlaylistLocalInsert = typeof playlistLocal.$inferInsert;
