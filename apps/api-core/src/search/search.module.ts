import { Module } from '@nestjs/common';
import { InnerTubeModule } from '../inner-tube/inner-tube.module.js';
import { SearchController } from './search.controller.js';
import { YoutubeService } from './youtube.service.js';

@Module({
  controllers: [SearchController],
  imports: [InnerTubeModule],
  providers: [YoutubeService],
})
export class SearchModule {}
