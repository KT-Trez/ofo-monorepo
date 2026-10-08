import { Injectable } from '@nestjs/common';
import type { MediaTrack, SearchResults } from '@ofo/server-contract';
import type { SearchItem } from '@ofo/ytdlp/mapper/types';
import { YT } from '@ofo/ytdlp/YT';
import { mapWdlError } from '../wdl-error.mapper.ts';
import { SearchCursor } from './search-cursor.js';

export type SearchParams = {
  limit: number;
  query: string;
  rawCursor?: string;
  signal?: AbortSignal;
};

@Injectable()
export class MediaSearchService {
  private static readonly FALLBACK_COVER_URL = 'https://placehold.co/1270x720?text=Not%20found';
  private static readonly SOURCE_YOUTUBE = 'youtube';

  constructor(private readonly wdl: YT) {}

  public async search({ limit, query, rawCursor, signal }: SearchParams): Promise<SearchResults> {
    const cursor = rawCursor ? SearchCursor.from(rawCursor, limit) : new SearchCursor(limit, 0);

    if (cursor.pageSize < 1) {
      return { items: [], next_cursor: null };
    }

    try {
      const found = await this.wdl.search({
        limit: cursor.pageSize,
        offset: cursor.offset,
        query,
        signal,
      });

      const hasMore = found.length >= cursor.pageSize;

      return {
        items: found.filter(item => this.isDownloadable(item)).map(this.toMediaTrack),
        next_cursor: hasMore && cursor.hasNext ? cursor.encodeNext() : null,
      };
    } catch (error) {
      throw mapWdlError(error, 'search');
    }
  }

  private isDownloadable(item: SearchItem) {
    return (
      item.durationMs !== null &&
      item.durationMs > 0 &&
      item.liveStatus !== 'is_live' &&
      item.liveStatus !== 'is_upcoming'
    );
  }

  private toMediaTrack(item: SearchItem): MediaTrack {
    return {
      artist:
        item.channelId && item.channelName
          ? {
              name: item.channelName,
              source: MediaSearchService.SOURCE_YOUTUBE,
              source_id: item.channelId,
            }
          : null,
      cover_url: item.thumbnails.at(0)?.url ?? MediaSearchService.FALLBACK_COVER_URL,
      duration_ms: item.durationMs,
      released_at: item.publishedAt,
      source: MediaSearchService.SOURCE_YOUTUBE,
      source_id: item.id,
      title: item.title,
    };
  }
}
