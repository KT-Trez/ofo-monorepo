import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfigApi, ClientPlatforms } from '@ofo/types/app-config';
import semver from 'semver';
import type { ApiCoreConfig } from '../../config/configuration.js';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<ApiCoreConfig>) {}

  getConfig(appVersion: string, platform: ClientPlatforms): AppConfigApi {
    const app = this.config.getOrThrow('app', { infer: true });
    const isDesktop = platform === 'desktop';
    const minVersion = isDesktop ? app.minSupportedDesktopVersion : app.minSupportedMobileVersion;

    return {
      formats: ['m4a', 'opus'],
      minSupportedVersion: minVersion,
      profile: app.profile,
      updateRequired: appVersion !== undefined && semver.lt(appVersion, minVersion),
    };
  }
}
