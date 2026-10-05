import type { ValueOf } from 'type-fest';

export const Availability = {
  NeedsAuth: 'needs_auth',
  PremiumOnly: 'premium_only',
  Private: 'private',
  Public: 'public',
  SubscriberOnly: 'subscriber_only',
  Unlisted: 'unlisted',
} as const;
export type Availabilities = ValueOf<typeof Availability>;

export const LiveStatus = {
  IsLive: 'is_live',
  IsUpcoming: 'is_upcoming',
  NotLive: 'not_live',
  PostLive: 'post_live',
  WasLive: 'was_live',
} as const;
export type LiveStatuses = ValueOf<typeof LiveStatus>;

export type SearchItem = {
  availability: Availabilities | null;
  channelId: string | null;
  channelName: string | null;
  /** Duration in milliseconds; `null` for live streams and when unknown. */
  durationMs: number | null;
  id: string;
  liveStatus: LiveStatuses | null;
  /** ISO 8601 (UTC); flat search results usually do not carry it. */
  publishedAt: string | null;
  thumbnails: Thumbnail[];
  title: string;
};

export type SearchOptions = {
  limit: number;
  offset: number;
  query: string;
  signal?: AbortSignal;
};

export type Thumbnail = {
  height: number | null;
  url: string;
  width: number | null;
};

export type VideoInfo = SearchItem & {
  /** `null` when the format list is missing, so the audio presence is unknown. */
  hasAudio: boolean | null;
};

export type VideoInfoOptions = {
  signal?: AbortSignal;
};
