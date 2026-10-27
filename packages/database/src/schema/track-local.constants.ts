import type { ValueOf } from 'type-fest';

export const AudioFormat = {
  M4a: 'm4a',
  Opus: 'opus',
} as const;
export type AudioFormats = ValueOf<typeof AudioFormat>;

export const DownloadErrorCode = {
  /** The app was closed while the track was downloading. */
  Interrupted: 9001,
} as const;
export type DownloadErrorCodes = ValueOf<typeof DownloadErrorCode>;

export const DownloadStatus = {
  /** The user stopped the download; listed with the failed ones and can be queued again. */
  Cancelled: 'cancelled',
  /** The file is on the device (`file_path`, `file_size_bytes`, `file_format` are set). */
  Downloaded: 'downloaded',
  /** Being downloaded now; marked `failed` on startup if the app was closed meanwhile. */
  Downloading: 'downloading',
  /** The download did not succeed (see `error_code`); can be queued again. */
  Failed: 'failed',
  /** In the library without a file and not waiting for one; can be queued. */
  NotDownloaded: 'not_downloaded',
  /** Waiting for its turn, oldest `queued_at` first. */
  Queued: 'queued',
} as const;
export type DownloadStatuses = ValueOf<typeof DownloadStatus>;

export const AUDIO_FORMATS = Object.freeze(Object.values(AudioFormat)) as readonly [
  AudioFormats,
  ...AudioFormats[],
];

export const DOWNLOAD_STATUSES = Object.freeze(Object.values(DownloadStatus)) as readonly [
  DownloadStatuses,
  ...DownloadStatuses[],
];
