import { sql } from 'drizzle-orm';
import { check, index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { isOneOf, unsafeSqlText } from './common.check.ts';
import { timestamp } from './timestamp.fragment.ts';
import { timestamps } from './timestamps.fragment.ts';
import { AUDIO_FORMATS, DOWNLOAD_STATUSES, DownloadStatus } from './track-local.constants.ts';
import { track } from './track.entity.ts';
import { uid } from './uid.fragment.ts';

export const trackLocal = sqliteTable(
  'track_local',
  // oxlint-disable sort-keys
  {
    ...timestamps(),
    errorCode: integer('error_code'),
    fileFormat: text('file_format', { enum: AUDIO_FORMATS }),
    filePath: text('file_path'),
    fileSizeBytes: integer('file_size_bytes'),
    queuedAt: timestamp('queued_at'),
    status: text('status', { enum: DOWNLOAD_STATUSES }).notNull(),
    trackUid: uid('track_uid')
      .primaryKey()
      .references(() => track.uid, { onDelete: 'cascade' }),
  },
  table => {
    const downloadedColumns = [table.filePath, table.fileSizeBytes, table.fileFormat];
    const isDownloaded = sql`(${table.status} = ${unsafeSqlText(DownloadStatus.Downloaded)})`;

    return [
      check(
        'track_local_error_code_check',
        sql`(${table.status} = ${unsafeSqlText(DownloadStatus.Failed)}) = (${table.errorCode} IS NOT NULL)`,
      ),
      check(
        'track_local_file_check',
        sql.join(
          downloadedColumns.map(column => sql`${isDownloaded} = (${column} IS NOT NULL)`),
          sql` AND `,
        ),
      ),
      check('track_local_file_format_check', isOneOf(table.fileFormat)),
      check('track_local_file_size_bytes_check', sql`${table.fileSizeBytes} > 0`),
      check(
        'track_local_queued_at_check',
        sql`${table.status} <> ${unsafeSqlText(DownloadStatus.Queued)} OR ${table.queuedAt} IS NOT NULL`,
      ),
      check('track_local_status_check', isOneOf(table.status)),
      index('track_local_status_index').on(table.status, table.queuedAt),
    ];
  },
);

export type TrackLocal = typeof trackLocal.$inferSelect;
export type TrackLocalInsert = typeof trackLocal.$inferInsert;
