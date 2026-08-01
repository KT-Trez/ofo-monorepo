import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import type { VideoApi } from '@ofo/types/video';
import { YoutubeQueryDto } from './dto/youtube-query.dto.js';
import { YoutubeService } from './youtube.service.js';

@UsePipes(new ValidationPipe())
@Controller({ path: 'search', version: '4' })
export class SearchController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('youtube')
  public async getYoutube(@Query() query: YoutubeQueryDto) {
    const { q, ...filters } = query;
    const search = await this.youtubeService.getVideosByPhrase(q, filters);

    return search.videos.reduce<VideoApi[]>((acc, item) => {
      const video = this.youtubeService.formatFeedItem(item);

      if (video) {
        acc.push(video);
      }

      return acc;
    }, []);
  }
}
