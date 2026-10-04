import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AudioFormat, ServerInfo } from '@ofo/server-contract';
import type { ServerConfig } from '../../config/configuration.js';

@Injectable()
export class ServerInfoService {
  public static readonly API_VERSION = '4.0.0';
  public static readonly AUDIO_FORMATS: AudioFormat[] = ['opus', 'm4a'];

  constructor(private readonly config: ConfigService<ServerConfig>) {}

  public getServerInfo(): ServerInfo {
    const auth = this.config.getOrThrow('auth', { infer: true });
    const { media, sync } = this.config.getOrThrow('features', { infer: true });

    return {
      api_version: ServerInfoService.API_VERSION,
      auth: {
        mode: auth.mode,
        ...(auth.mode === 'oidc' && { audience: auth.oidc.audience, issuer: auth.oidc.issuer }),
      },
      features: {
        media: media.enabled
          ? {
              audio_formats: ServerInfoService.AUDIO_FORMATS,
              default_audio_format: media.default_audio_format,
              enabled: true,
              max_concurrent_downloads: media.max_concurrent_downloads,
              prepare_timeout_seconds: media.prepare_timeout_seconds,
              sources: media.sources,
            }
          : { enabled: false },
        sync: sync.enabled
          ? {
              enabled: true,
              max_cover_bytes: sync.max_cover_bytes,
              max_push_batch: sync.max_push_batch,
              tombstone_retention_days: sync.tombstone_retention_days,
            }
          : { enabled: false },
      },
    };
  }
}
