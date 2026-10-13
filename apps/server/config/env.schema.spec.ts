import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSchemaIssues } from '../test/core/get-schema-issues.ts';
import { EnvPreprocess, EnvSchema, isMediaEnabled, isSyncEnabled } from './env.schema.ts';

describe('EnvPreprocess', () => {
  it.for([undefined, null, 'string', 42])('should return an empty object for %s', env => {
    // when
    const result = EnvPreprocess(env);

    // then
    expect(result).toEqual({});
  });

  it('should drop the empty string values', () => {
    // given
    const env = { AUTH_TOKEN: '', PORT: '8080', YTDLP_PATH: ' ' };

    // when
    const result = EnvPreprocess(env);

    // then
    expect(result).toEqual({ PORT: '8080', YTDLP_PATH: ' ' });
  });
});

describe('EnvSchema', () => {
  it('should apply the defaults to an empty env', () => {
    // when
    const env = EnvSchema.parse({});

    // then
    expect(env).toEqual({
      AUDIO_TMP_DIR: join(tmpdir(), 'music-ofo'),
      AUTH_MODE: 'none',
      FFMPEG_PATH: 'ffmpeg',
      FFPROBE_PATH: 'ffprobe',
      MEDIA_ENABLED: true,
      MEDIA_MAX_CONCURRENT_DOWNLOADS: 3,
      MEDIA_PREPARE_TIMEOUT_SECONDS: 300,
      PORT: 5000,
      SYNC_ENABLED: false,
      SYNC_MAX_COVER_BYTES: 5_242_880,
      SYNC_MAX_PUSH_BATCH: 500,
      SYNC_TOMBSTONE_RETENTION_DAYS: 90,
      YTDLP_INFO_TIMEOUT_SEC: 30,
      YTDLP_JS_RUNTIME: 'node',
      YTDLP_PATH: 'yt-dlp',
      YTDLP_SEARCH_TIMEOUT_SEC: 30,
    });
  });

  it('should treat the empty strings as unset', () => {
    // when
    const env = EnvSchema.parse({ AUTH_MODE: '', MEDIA_ENABLED: '', PORT: '' });

    // then
    expect(env).toMatchObject({ AUTH_MODE: 'none', MEDIA_ENABLED: true, PORT: 5000 });
  });

  it('should coerce the numeric values', () => {
    // when
    const env = EnvSchema.parse({
      MEDIA_MAX_CONCURRENT_DOWNLOADS: '5',
      PORT: '0',
      SYNC_MAX_PUSH_BATCH: '1',
    });

    // then
    expect(env).toMatchObject({
      MEDIA_MAX_CONCURRENT_DOWNLOADS: 5,
      PORT: 0,
      SYNC_MAX_PUSH_BATCH: 1,
    });
  });

  it.for([
    ['MEDIA_MAX_CONCURRENT_DOWNLOADS', '0'],
    ['MEDIA_PREPARE_TIMEOUT_SECONDS', '-1'],
    ['SYNC_MAX_COVER_BYTES', '1.5'],
    ['YTDLP_INFO_TIMEOUT_SEC', 'abc'],
    ['PORT', '-1'],
    ['PORT', '80.5'],
  ] as const)('should reject %s=%s', ([key, value]) => {
    // when
    const result = EnvSchema.safeParse({ [key]: value });

    // then
    expect(result.success).toBe(false);
    expect(result.error?.issues.at(0)?.path).toEqual([key]);
  });

  it('should reject an unknown AUTH_MODE', () => {
    // when
    const result = EnvSchema.safeParse({ AUTH_MODE: 'basic' });

    // then
    expect(result.success).toBe(false);
  });

  it('should reject an invalid AUTH_OIDC_ISSUER', () => {
    // when
    const result = EnvSchema.safeParse({ AUTH_OIDC_ISSUER: 'not-a-url' });

    // then
    expect(result.success).toBe(false);
  });

  it('should accept AUTH_MODE=token with an AUTH_TOKEN', () => {
    // when
    const env = EnvSchema.parse({ AUTH_MODE: 'token', AUTH_TOKEN: 'secret' });

    // then
    expect(env).toMatchObject({ AUTH_MODE: 'token', AUTH_TOKEN: 'secret' });
  });

  it.for([{}, { AUTH_TOKEN: '' }])(
    'should require an AUTH_TOKEN for AUTH_MODE=token (%o)',
    extra => {
      // when
      const messages = getSchemaIssues(EnvSchema, { AUTH_MODE: 'token', ...extra });

      // then
      expect(messages).toEqual(['AUTH_MODE=token requires a non-empty AUTH_TOKEN']);
    },
  );

  it('should require the issuer and the audience for AUTH_MODE=oidc', () => {
    // when
    const messages = getSchemaIssues(EnvSchema, { AUTH_MODE: 'oidc' });

    // then
    expect(messages).toContain('AUTH_MODE=oidc requires AUTH_OIDC_ISSUER and AUTH_OIDC_AUDIENCE');
  });

  it('should reject AUTH_MODE=oidc as not implemented yet', () => {
    // when
    const messages = getSchemaIssues(EnvSchema, {
      AUTH_MODE: 'oidc',
      AUTH_OIDC_AUDIENCE: 'ofo',
      AUTH_OIDC_ISSUER: 'https://auth.example.com',
    });

    // then
    expect(messages).toEqual([
      'AUTH_MODE=oidc is not implemented yet (phase 2), use "none" or "token"',
    ]);
  });

  it('should require AUTH_MODE=oidc for SYNC_ENABLED=true', () => {
    // when
    const messages = getSchemaIssues(EnvSchema, { SYNC_ENABLED: 'true' });

    // then
    expect(messages).toEqual([
      'SYNC_ENABLED=true requires AUTH_MODE=oidc',
      'SYNC_ENABLED=true is not implemented yet (phase 2)',
    ]);
  });

  it('should reject SYNC_ENABLED=true as not implemented yet', () => {
    // when
    const messages = getSchemaIssues(EnvSchema, {
      AUTH_MODE: 'oidc',
      AUTH_OIDC_AUDIENCE: 'ofo',
      AUTH_OIDC_ISSUER: 'https://auth.example.com',
      SYNC_ENABLED: 'true',
    });

    // then
    expect(messages).toContain('SYNC_ENABLED=true is not implemented yet (phase 2)');
    expect(messages).not.toContain('SYNC_ENABLED=true requires AUTH_MODE=oidc');
  });
});

describe('isMediaEnabled', () => {
  it.for([
    [{}, true],
    [{ MEDIA_ENABLED: '' }, true],
    [{ MEDIA_ENABLED: 'true' }, true],
    [{ MEDIA_ENABLED: 'false' }, false],
    [{ MEDIA_ENABLED: 'false', SYNC_ENABLED: 'true' }, false],
  ] as const)('should return the MEDIA_ENABLED flag for %o', ([env, expected]) => {
    // when
    const enabled = isMediaEnabled(env);

    // then
    expect(enabled).toBe(expected);
  });

  it('should throw for an invalid boolean', () => {
    // when
    const act = () => isMediaEnabled({ MEDIA_ENABLED: 'maybe' });

    // then
    expect(act).toThrow('Invalid option');
  });
});

describe('isSyncEnabled', () => {
  it.for([
    [{}, false],
    [{ SYNC_ENABLED: '' }, false],
    [{ SYNC_ENABLED: 'false' }, false],
    [{ SYNC_ENABLED: 'true' }, true],
    [{ MEDIA_ENABLED: 'true', SYNC_ENABLED: 'false' }, false],
  ] as const)('should return the SYNC_ENABLED flag for %o', ([env, expected]) => {
    // when
    const enabled = isSyncEnabled(env);

    // then
    expect(enabled).toBe(expected);
  });
});
