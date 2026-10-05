import type { ValueOf } from 'type-fest';

export const AudioFormat = {
  M4a: 'm4a',
  Opus: 'opus',
} as const;
export type AudioFormats = ValueOf<typeof AudioFormat>;

export type DownloadOptions = {
  format: AudioFormats;
  outDir: string;
  signal?: AbortSignal;
  sourceId: string;
};

export type DownloadResult = {
  /** `0` when the duration could not be determined. */
  durationMs: number;
  /** Absolute path of `<outDir>/<sourceId>.<format>`. */
  path: string;
  sizeBytes: number;
};
