import { Inject, Injectable } from '@nestjs/common';
import Innertube, { Misc, Types, YTNodes } from 'youtubei.js';
import type { AuthorApi } from '@ofo/types/author';
import type { VideoApi } from '@ofo/types/video';
import { INNER_TUBE_TOKEN } from '../inner-tube/inner-tube.module.js';

@Injectable()
export class YoutubeService {
  constructor(@Inject(INNER_TUBE_TOKEN) private readonly innerTube: Innertube) {}

  public formatFeedItem(item: unknown) {
    if (item instanceof YTNodes.CompactVideo) {
      return this.formatCompactVideo(item);
    }

    if (item instanceof YTNodes.GridVideo) {
      return this.formatGridVideo(item);
    }

    if (item instanceof YTNodes.PlaylistVideo) {
      return this.formatPlaylistVideo(item);
    }

    if (item instanceof YTNodes.Video) {
      return this.formatVideo(item);
    }

    return null;
  }

  public getVideosByPhrase(phrase: string, filters?: Partial<Types.SearchFilters>) {
    return this.innerTube.search(phrase, {
      ...filters,
      type: 'video',
    });
  }

  private formatAuthor(author: Misc.Author): AuthorApi {
    return {
      id: author.id,
      name: author.name,
      thumbnailUrl: author.best_thumbnail?.url ?? author.thumbnails.at(0)?.url ?? null,
      url: author.url,
    };
  }

  private formatCompactVideo(video: YTNodes.CompactVideo): VideoApi {
    return {
      author: this.formatAuthor(video.author),
      duration: video.duration.seconds,
      id: video.video_id,
      thumbnailUrl: video.best_thumbnail.url,
      title: video.title.toString(),
      views: this.parseInteger(video.view_count),
    };
  }

  private formatGridVideo(video: YTNodes.GridVideo): VideoApi | null {
    const duration = this.parseInteger(video.duration);

    if (typeof duration !== 'number') {
      return null;
    }

    return {
      author: this.formatAuthor(video.author),
      duration: duration,
      id: video.video_id,
      thumbnailUrl: video.thumbnails.at(0)?.url ?? null,
      title: video.title.toString(),
      views: this.parseInteger(video.views),
    };
  }

  private formatPlaylistVideo(video: YTNodes.PlaylistVideo): VideoApi {
    return {
      author: this.formatAuthor(video.author),
      duration: video.duration.seconds,
      id: video.id,
      thumbnailUrl: video.thumbnails.at(0)?.url ?? null,
      title: video.title.toString(),
      views: null,
    };
  }

  private formatVideo(video: YTNodes.Video): VideoApi {
    return {
      author: this.formatAuthor(video.author),
      duration: video.duration.seconds,
      id: video.video_id,
      thumbnailUrl: video.best_thumbnail?.url ?? video.thumbnails.at(0)?.url ?? null,
      title: video.title.toString(),
      views: this.parseInteger(video.view_count),
    };
  }

  private parseInteger(text: Misc.Text | null | undefined): number | null {
    const number = text ? Number.parseInt(text.toString().replace(/\D/gi, '')) : null;

    return Number.isInteger(number) ? number : null;
  }
}
