import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSchemaIssues } from '../test/core/get-schema-issues.ts';
import { ConfigurationSchema, type ServerConfig } from './configuration.schema.ts';

describe('ConfigurationSchema', () => {
  it('should map the default env to the configuration', () => {
    // when
    const config = ConfigurationSchema.parse({});

    // then
    expect(config).toEqual<ServerConfig>({
      app: { port: 8080 },
      audio: {
        ffmpegPath: 'ffmpeg',
        ffprobePath: 'ffprobe',
        tmpDir: join(tmpdir(), 'music-ofo'),
      },
      auth: {
        mode: 'none',
        oidc: { audience: undefined, issuer: undefined },
        token: undefined,
      },
      features: {
        media: {
          default_audio_format: 'opus',
          enabled: true,
          max_concurrent_downloads: 3,
          prepare_timeout_seconds: 300,
          sources: ['youtube'],
        },
        sync: {
          enabled: false,
          max_cover_bytes: 5_242_880,
          max_push_batch: 500,
          tombstone_retention_days: 90,
        },
      },
      ytdlp: {
        infoTimeoutSec: 30,
        jsRuntime: 'node',
        path: 'yt-dlp',
        searchTimeoutSec: 30,
      },
    });
  });

  it('should map the custom env to the configuration', () => {
    // when
    const config = ConfigurationSchema.parse({
      AUDIO_TMP_DIR: '/var/tmp/ofo',
      AUTH_MODE: 'token',
      AUTH_TOKEN: 'secret',
      FFMPEG_PATH: '/usr/bin/ffmpeg',
      FFPROBE_PATH: '/usr/bin/ffprobe',
      MEDIA_ENABLED: 'false',
      MEDIA_MAX_CONCURRENT_DOWNLOADS: '1',
      MEDIA_PREPARE_TIMEOUT_SECONDS: '60',
      PORT: '9090',
      SYNC_MAX_COVER_BYTES: '1024',
      SYNC_MAX_PUSH_BATCH: '10',
      SYNC_TOMBSTONE_RETENTION_DAYS: '7',
      YTDLP_INFO_TIMEOUT_SEC: '15',
      YTDLP_JS_RUNTIME: 'deno',
      YTDLP_PATH: '/usr/local/bin/yt-dlp',
      YTDLP_SEARCH_TIMEOUT_SEC: '20',
    });

    // then
    expect(config).toEqual<ServerConfig>({
      app: { port: 9090 },
      audio: {
        ffmpegPath: '/usr/bin/ffmpeg',
        ffprobePath: '/usr/bin/ffprobe',
        tmpDir: '/var/tmp/ofo',
      },
      auth: {
        mode: 'token',
        oidc: { audience: undefined, issuer: undefined },
        token: 'secret',
      },
      features: {
        media: {
          default_audio_format: 'opus',
          enabled: false,
          max_concurrent_downloads: 1,
          prepare_timeout_seconds: 60,
          sources: ['youtube'],
        },
        sync: {
          enabled: false,
          max_cover_bytes: 1024,
          max_push_batch: 10,
          tombstone_retention_days: 7,
        },
      },
      ytdlp: {
        infoTimeoutSec: 15,
        jsRuntime: 'deno',
        path: '/usr/local/bin/yt-dlp',
        searchTimeoutSec: 20,
      },
    });
  });

  it('should fail when the env is invalid', () => {
    // when
    const issues = getSchemaIssues(ConfigurationSchema, { AUTH_MODE: 'token' });

    // then

    expect(issues).toEqual(['AUTH_MODE=token requires a non-empty AUTH_TOKEN']);
  });
});
