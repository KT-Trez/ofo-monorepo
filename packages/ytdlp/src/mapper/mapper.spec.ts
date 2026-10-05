import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MetadataMapper } from './mapper.ts';

describe('MetadataMapper', () => {
  const mapper = new MetadataMapper();

  const getFixture = (name: string): unknown => {
    const path = new URL(`../../test/fixtures/${name}.json`, import.meta.url);
    const content = readFileSync(path, 'utf8');

    return JSON.parse(content);
  };

  describe('toSearchResults', () => {
    it('should map flat search entries and skip the unusable ones', () => {
      // given
      const raw = getFixture('search-flat');

      // when
      const items = mapper.toSearchResults(raw);

      // then
      expect(items.map(item => item.id)).toEqual(['jfKfPfyJRdk', '5qap5aO4i9A', 'dQw4w9WgXcQ']);
    });

    it('should map a live entry without duration and with channel data', () => {
      // given
      const raw = getFixture('search-flat');

      // when
      const [live] = mapper.toSearchResults(raw);

      // when / then
      expect(live).toEqual({
        availability: null,
        channelId: 'UCSJ4gkVC6NrvII8umztf0Ow',
        channelName: 'Lofi Girl',
        durationMs: null,
        id: 'jfKfPfyJRdk',
        liveStatus: 'is_live',
        publishedAt: null,
        thumbnails: [
          { height: 188, url: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg', width: 336 },
          { height: 404, url: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hq720.jpg', width: 720 },
        ],
        title: 'lofi hip hop radio - beats to relax/study to',
      });
    });

    it('should fall back to the uploader name and null sizes of thumbnails', () => {
      // given
      const raw = getFixture('search-flat');

      // when
      const item = mapper.toSearchResults(raw).at(1);

      // then
      expect(item?.channelName).toBe('Chill Records');
      expect(item?.durationMs).toBe(3_725_000);
      expect(item?.thumbnails).toEqual([
        { height: null, url: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg', width: null },
      ]);
    });

    it('should round fractional durations and ignore unknown enum values', () => {
      // given
      const raw = getFixture('search-flat');

      // when
      const item = mapper.toSearchResults(raw).at(2);

      //  then
      expect(item?.durationMs).toBe(212_400);
      expect(item?.liveStatus).toBeNull();
      expect(item?.availability).toBe('public');
    });

    it('should return an empty list for a payload without entries', () => {
      // given / when / then
      expect(mapper.toSearchResults({})).toEqual([]);
      expect(mapper.toSearchResults(null)).toEqual([]);
    });
  });

  describe('toVideoInfo', () => {
    it('should map the full info with the date taken from the timestamp', () => {
      // given
      const raw = getFixture('info-video');

      // when
      const info = mapper.toVideoInfo(raw);

      // then
      expect(info).toMatchObject({
        availability: 'public',
        channelId: 'UC4QobU6STFB0P71PMvOGN5A',
        channelName: 'jawed',
        durationMs: 19_000,
        hasAudio: true,
        id: 'jNQXAC9IVRw',
        liveStatus: 'not_live',
        publishedAt: '2005-04-24T00:00:00.000Z',
        title: 'Me at the zoo',
      });
      expect(info?.thumbnails).toHaveLength(2);
    });

    it('should prefer release_timestamp over timestamp and upload_date', () => {
      // given
      const raw: unknown = {
        id: 'a',
        release_timestamp: 1700000000,
        timestamp: 1600000000,
        title: 't',
        upload_date: '20200101',
      };

      // when
      const info = mapper.toVideoInfo(raw);

      // when / then
      expect(info?.publishedAt).toBe('2023-11-14T22:13:20.000Z');
    });

    it('should use upload_date when no timestamp is present and detect missing audio', () => {
      // given
      const raw = getFixture('info-upload-date-only');

      // when
      const info = mapper.toVideoInfo(raw);

      // then
      expect(info).toMatchObject({
        channelId: null,
        channelName: 'Some Uploader',
        durationMs: 5500,
        hasAudio: false,
        liveStatus: 'was_live',
        publishedAt: '2024-02-29T00:00:00.000Z',
      });
    });

    it('should report unknown audio presence when formats are missing', () => {
      // given / when / then
      expect(mapper.toVideoInfo({ id: 'a', title: 't' })?.hasAudio).toBeNull();
    });

    it.for(['20241345', 'yesterday'])(
      'should return null date for a malformed upload_date: "%s"',
      date => {
        // given
        const raw: unknown = {
          id: 'a',
          title: 't',
          upload_date: date,
        };

        // when
        const info = mapper.toVideoInfo(raw);

        // then
        expect(info?.publishedAt).toBeNull();
      },
    );

    it('should return null for input that is not an object with id and title', () => {
      // given / when / then
      expect(mapper.toVideoInfo('nope')).toBeNull();
      expect(mapper.toVideoInfo({ id: 'a' })).toBeNull();
    });
  });
});
