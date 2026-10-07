import { Module, type OnModuleInit } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthRegistryService } from '../health/health-registry.service.js';
import { AudioDownloadService } from './audio/audio-download.service.js';
import { CoverService } from './cover/cover.service.js';
import { MediaController } from './media.controller.js';
import { MediaSearchService } from './search/media-search.service.js';
import { WdlReadiness } from './wdl-readiness.service.ts';
import { WDL_PROVIDER } from './wdl.provider.ts';

/**
 * The `media` feature (`/v4/media/*`), registered only when `features.media.enabled`
 * (see `AppModule`); `FeatureGatesModule` answers 1003 on its paths otherwise.
 */
@Module({
  controllers: [MediaController],
  imports: [TerminusModule],
  providers: [AudioDownloadService, CoverService, MediaSearchService, WdlReadiness, WDL_PROVIDER],
})
export class MediaModule implements OnModuleInit {
  constructor(
    private readonly health: HealthRegistryService,
    private readonly readiness: WdlReadiness,
  ) {}

  onModuleInit(): void {
    this.health.register('ytdlp', () => this.readiness.check());
  }
}
