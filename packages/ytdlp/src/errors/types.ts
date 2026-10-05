import type { ValueOf } from 'type-fest';

export const YTErrorKind = {
  AgeRestricted: 'age_restricted',
  Blocked: 'blocked',
  Conversion: 'conversion',
  ExtractorOutdated: 'extractor_outdated',
  LiveStream: 'live_stream',
  Network: 'network',
  NoAudio: 'no_audio',
  RegionBlocked: 'region_blocked',
  Unknown: 'unknown',
  VideoPrivate: 'video_private',
  VideoUnavailable: 'video_unavailable',
} as const;
export type YTErrorKinds = ValueOf<typeof YTErrorKind>;
