import { RawObject } from './raw-object.ts';
import {
  type Availabilities,
  Availability,
  LiveStatus,
  type LiveStatuses,
  type SearchItem,
  type Thumbnail,
  type VideoInfo,
} from './types.ts';

export class MetadataMapper {
  private static readonly AVAILABILITIES: string[] = Object.values(Availability);
  private static readonly LIVE_STATUSES: string[] = Object.values(LiveStatus);

  toSearchItem(raw: unknown): SearchItem | null {
    const object = RawObject.from(raw);

    return object ? this.searchItem(object) : null;
  }

  toSearchResults(raw: unknown): SearchItem[] {
    const entries = RawObject.from(raw)?.list('entries') ?? [];

    return entries.map(entry => this.toSearchItem(entry)).filter(item => item !== null);
  }

  toVideoInfo(raw: unknown): VideoInfo | null {
    const object = RawObject.from(raw);
    const item = object ? this.searchItem(object) : null;

    return item && object ? { ...item, hasAudio: this.hasAudio(object) } : null;
  }

  private searchItem(raw: RawObject): SearchItem | null {
    const id = raw.string('id');
    const title = raw.string('title');

    if (!id || !title) {
      return null;
    }

    const availability = raw.string('availability');
    const duration = raw.number('duration');
    const liveStatus = raw.string('live_status');

    const availabilityOk = availability && MetadataMapper.AVAILABILITIES.includes(availability);
    const liveStatusOk = liveStatus && MetadataMapper.LIVE_STATUSES.includes(liveStatus);

    return {
      availability: availabilityOk ? (availability as Availabilities) : null,
      channelId: raw.string('channel_id'),
      channelName: raw.string('channel') ?? raw.string('uploader'),
      durationMs: duration === null ? null : Math.round(duration * 1000),
      id,
      liveStatus: liveStatusOk ? (liveStatus as LiveStatuses) : null,
      publishedAt: this.publishedAt(raw),
      thumbnails: this.thumbnails(raw),
      title,
    };
  }

  private publishedAt(raw: RawObject): string | null {
    for (const key of ['release_timestamp', 'timestamp']) {
      const seconds = raw.number(key);

      if (seconds !== null) {
        return new Date(seconds * 1000).toISOString();
      }
    }

    const uploadDate = raw.string('upload_date');
    const match = uploadDate ? /^(\d{4})(\d{2})(\d{2})$/.exec(uploadDate) : null;

    if (!match) {
      return null;
    }

    const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`);

    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  private thumbnails(raw: RawObject): Thumbnail[] {
    const thumbnails: Thumbnail[] = [];

    for (const candidate of raw.list('thumbnails') ?? []) {
      const thumbnail = RawObject.from(candidate);
      const url = thumbnail?.string('url');

      if (thumbnail && url) {
        thumbnails.push({
          height: thumbnail.number('height'),
          url,
          width: thumbnail.number('width'),
        });
      }
    }

    return thumbnails;
  }

  private hasAudio(raw: RawObject): boolean | null {
    const formats = raw.list('formats');

    if (!formats || formats.length === 0) {
      return null;
    }

    return formats.some(candidate => {
      const acodec = RawObject.from(candidate)?.value('acodec');

      return typeof acodec === 'string' && acodec !== 'none';
    });
  }
}
