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
  Cancelled: 'cancelled',
  Downloaded: 'downloaded',
  Downloading: 'downloading',
  Failed: 'failed',
  NotDownloaded: 'not_downloaded',
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
