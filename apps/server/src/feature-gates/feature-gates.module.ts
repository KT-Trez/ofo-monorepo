import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ServerConfig } from '../../config/configuration.js';
import { featureDisabledMiddleware } from './feature-disabled.middleware.js';

@Module({})
export class FeatureGatesModule implements NestModule {
  /** The `sync` module will be implemented in phase 2. */
  private static readonly SYNC_AVAILABLE = false;

  constructor(private readonly config: ConfigService<ServerConfig>) {}

  configure(consumer: MiddlewareConsumer) {
    const features = this.config.getOrThrow('features', { infer: true });

    if (!features.media.enabled) {
      consumer.apply(featureDisabledMiddleware('media')).forRoutes('v4/media', 'v4/media/{*path}');
    }

    if (!features.sync.enabled || !FeatureGatesModule.SYNC_AVAILABLE) {
      consumer.apply(featureDisabledMiddleware('sync')).forRoutes('v4/sync', 'v4/sync/{*path}');
    }
  }
}
