import type { ServerInfo } from '@ofo/server-contract';
import { describe, expect, it } from 'vitest';
import { createTestModule } from '../../test/core/create-test-module.ts';
import { ServerInfoService } from './server-info.service.js';

describe('ServerInfoService', () => {
  const createService = async (env: Record<string, string>) => {
    const moduleRef = await createTestModule(env, { providers: [ServerInfoService] });

    return moduleRef.get(ServerInfoService);
  };

  it('should return the default configuration', async () => {
    // given
    const service = await createService({});

    // when
    const info = service.getServerInfo();

    // then
    expect(info).toEqual<ServerInfo>({
      api_version: ServerInfoService.API_VERSION,
      auth: { mode: 'none' },
      features: {
        media: {
          audio_formats: ['opus', 'm4a'],
          default_audio_format: 'opus',
          enabled: true,
          max_concurrent_downloads: 3,
          prepare_timeout_seconds: 300,
          sources: ['youtube'],
        },
        sync: { enabled: false },
      },
    });
  });

  it('should return the media configuration when media feature is disabled', async () => {
    // given
    const service = await createService({ MEDIA_ENABLED: 'false' });

    // when
    const info = service.getServerInfo();

    // then
    expect(info.features.media).toEqual({ enabled: false });
  });

  it('should return the OIDC auth configuration when "auth.mode" is "oidc"', async () => {
    // given
    const service = await createService({
      AUTH_MODE: 'oidc',
      AUTH_OIDC_AUDIENCE: 'ofo',
      AUTH_OIDC_ISSUER: 'https://example.com',
      AUTH_TOKEN: 'must-not-leak',
    });

    // when
    const info = service.getServerInfo();

    // then
    expect(info.auth).toEqual({
      audience: 'ofo',
      issuer: 'https://example.com',
      mode: 'oidc',
    });
  });

  it('should return the sync configuration when sync feature is enabled', async () => {
    // given
    const service = await createService({
      SYNC_ENABLED: 'true',
      SYNC_MAX_COVER_BYTES: '1024',
      SYNC_MAX_PUSH_BATCH: '100',
      SYNC_TOMBSTONE_RETENTION_DAYS: '7',
    });

    // when
    const info = service.getServerInfo();

    // then
    expect(info.features.sync).toEqual({
      enabled: true,
      max_cover_bytes: 1024,
      max_push_batch: 100,
      tombstone_retention_days: 7,
    });
  });
});
