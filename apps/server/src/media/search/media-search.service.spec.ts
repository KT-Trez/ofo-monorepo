import { YTError } from '@ofo/ytdlp/errors/YT-error';
import type { SearchItem } from '@ofo/ytdlp/mapper/types';
import { YT } from '@ofo/ytdlp/YT';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestModule } from '../../../test/core/create-test-module.ts';
import { MediaSearchService } from './media-search.service.js';
import { SearchCursor } from './search-cursor.js';

describe('MediaSearchService', () => {
  const maxSearchDepth = 200;
  const search = vi.fn<YT['search']>();

  let service: MediaSearchService;

  const createSearchItem = (id: string, overrides?: Partial<SearchItem>): SearchItem => ({
    availability: null,
    channelId: 'UC1',
    channelName: 'Channel',
    durationMs: 1000,
    id,
    liveStatus: null,
    publishedAt: null,
    thumbnails: [],
    title: `Title ${id}`,
    ...overrides,
  });

  const createSearchItems = (count: number, from = 0) => {
    return Array.from({ length: count }, (_value, index) => createSearchItem(`id-${from + index}`));
  };

  const cursorAt = (offset: number) => {
    return Buffer.from(JSON.stringify({ o: offset, v: 1 })).toString('base64url');
  };

  const offsetOf = (cursor: string | null) => SearchCursor.from(cursor!, 1).offset;

  beforeEach(async () => {
    const moduleRef = await createTestModule(
      {},
      {
        providers: [
          MediaSearchService,
          { provide: YT, useValue: { search } satisfies Partial<YT> },
        ],
      },
    );

    service = moduleRef.get(MediaSearchService);
  });

  it('should ask yt-dlp for the first page and return a cursor for the next one', async () => {
    // given
    search.mockResolvedValue(createSearchItems(20));

    // when
    const page = await service.search({ limit: 20, query: 'lofi' });

    // then
    expect(search).toHaveBeenCalledWith({ limit: 20, offset: 0, query: 'lofi', signal: undefined });
    expect(page.items).toHaveLength(20);
    expect(offsetOf(page.next_cursor)).toBe(20);
  });

  it('should continue from the offset stored in the cursor', async () => {
    // given
    search.mockResolvedValue(createSearchItems(5, 20));

    // when
    const page = await service.search({
      limit: 5,
      query: 'lofi',
      rawCursor: cursorAt(20),
    });

    // then
    expect(search).toHaveBeenCalledWith(expect.objectContaining({ limit: 5, offset: 20 }));
    expect(offsetOf(page.next_cursor)).toBe(25);
  });

  it('should return no cursor when yt-dlp found fewer results than requested', async () => {
    // given
    search.mockResolvedValue(createSearchItems(3));

    // when
    const page = await service.search({ limit: 20, query: 'rare' });

    // then
    expect(page.next_cursor).toBeNull();
  });

  it('should leave out live streams and items without a duration but keep paging', async () => {
    // given
    search.mockResolvedValue([
      createSearchItem('ok'),
      createSearchItem('live', { liveStatus: 'is_live' }),
      createSearchItem('nodur', { durationMs: null }),
    ]);

    // when
    const page = await service.search({ limit: 3, query: 'x' });

    // then
    expect(page.items.map(track => track.source_id)).toEqual(['ok']);
    expect(page.next_cursor).not.toBeNull();
  });

  it('should stop paging at the maximum depth', async () => {
    // given
    search.mockImplementation(({ limit }) => Promise.resolve(createSearchItems(limit)));

    // when
    const last = await service.search({
      limit: 50,
      query: 'x',
      rawCursor: cursorAt(maxSearchDepth - 10),
    });
    const beyond = await service.search({
      limit: 50,
      query: 'x',
      rawCursor: cursorAt(maxSearchDepth),
    });

    // then
    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith(expect.objectContaining({ limit: 10 }));
    expect(last.next_cursor).toBeNull();
    expect(beyond).toEqual({ items: [], next_cursor: null });
  });

  it('should reject an invalid cursor with 1004 before calling yt-dlp', async () => {
    // when
    const result = service.search({ limit: 20, query: 'x', rawCursor: '***' });

    // then
    await expect(result).rejects.toMatchObject({ code: 1004 });
    expect(search).not.toHaveBeenCalled();
  });

  it('should map yt-dlp failures to API errors', async () => {
    // given
    search.mockRejectedValue(new YTError('network', 'offline', { exitCode: 1, stderr: '' }));

    // when
    const result = service.search({ limit: 20, query: 'x' });

    // then
    await expect(result).rejects.toMatchObject({ code: 2020 });
  });
});
