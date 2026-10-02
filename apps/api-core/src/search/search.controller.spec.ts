import { randomInt } from 'crypto';
import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { YoutubeQueryDto } from './dto/youtube-query.dto.js';
import { SearchController } from './search.controller.js';
import { YoutubeService } from './youtube.service.js';

describe('SearchController', () => {
  let controller: SearchController;
  const formatFeedItemMock = vi.fn<(item: unknown) => unknown>().mockReturnValue(null);
  const getVideosByPhraseMock = vi
    .fn<(phrase: string, filters: object) => Promise<{ videos: unknown[] }>>()
    .mockResolvedValue({ videos: [] });
  const queryMock: YoutubeQueryDto = {
    q: 'q-mock',
  };
  const youtubeServiceMock = {
    formatFeedItem: formatFeedItemMock,
    getVideosByPhrase: getVideosByPhraseMock,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [{ provide: YoutubeService, useValue: youtubeServiceMock }],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should search for YouTube songs', async () => {
    // when
    const result = await controller.getYoutube(queryMock);

    // then
    expect(getVideosByPhraseMock).toHaveBeenCalledWith(queryMock.q, {});
    expect(formatFeedItemMock).not.toHaveBeenCalled();

    expect(result).toEqual([]);
  });

  it('should search and format YouTube songs', async () => {
    // given
    const rawVideoA = { id: `raw-video-id-${randomInt(1_000_000)}` };
    const ravVideoB = { id: `raw-video-id-${randomInt(1_000_000)}` };
    const videoA = { id: `video-id-${randomInt(1_000_000)}` };
    const videoB = { id: `video-id-${randomInt(1_000_000)}` };

    formatFeedItemMock.mockReturnValueOnce(videoA).mockReturnValueOnce(videoB);
    getVideosByPhraseMock.mockResolvedValue({ videos: [rawVideoA, ravVideoB] });

    // when
    const result = await controller.getYoutube(queryMock);

    // then
    expect(formatFeedItemMock).toHaveBeenCalledTimes(2);
    expect(formatFeedItemMock).toHaveBeenNthCalledWith(1, rawVideoA);
    expect(formatFeedItemMock).toHaveBeenNthCalledWith(2, ravVideoB);

    expect(result).toEqual([videoA, videoB]);
  });

  it('should search and format and skip unformatted YouTube songs', async () => {
    // given
    const rawVideoA = { id: `raw-video-id-${randomInt(1_000_000)}` };
    const rawVideoB = { id: `raw-video-id-${randomInt(1_000_000)}` };
    const video = { id: `video-id-${randomInt(1_000_000)}` };

    formatFeedItemMock.mockReturnValueOnce(video).mockReturnValueOnce(null);
    getVideosByPhraseMock.mockResolvedValue({ videos: [rawVideoA, rawVideoB] });

    // when
    const result = await controller.getYoutube(queryMock);

    // then
    expect(formatFeedItemMock).toHaveBeenCalledTimes(2);
    expect(formatFeedItemMock).toHaveBeenNthCalledWith(1, rawVideoA);
    expect(formatFeedItemMock).toHaveBeenNthCalledWith(2, rawVideoB);

    expect(result).toEqual([video]);
  });
});
