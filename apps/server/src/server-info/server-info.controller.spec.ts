import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createTestApp } from '../../test/core/create-test-app.ts';
import { AuthModule } from '../auth/auth.module.js';
import { ServerInfoModule } from './server-info.module.js';

describe('GET /v4/server', () => {
  let app: NestExpressApplication | undefined;

  afterEach(async () => {
    await app?.close();
  });

  it('should reflect the configured media parameters', async () => {
    // given
    app = await createTestApp(
      {
        MEDIA_DEFAULT_AUDIO_FORMAT: 'm4a',
        MEDIA_MAX_CONCURRENT_DOWNLOADS: '5',
        MEDIA_PREPARE_TIMEOUT_SECONDS: '120',
      },
      { imports: [ServerInfoModule] },
    );

    // when
    const response = await request(app.getHttpServer()).get('/v4/server');

    // then
    expect(response.status).toBe(200);
    expect(response.body.features.media).toMatchObject({
      default_audio_format: 'm4a',
      max_concurrent_downloads: 5,
      prepare_timeout_seconds: 120,
    });
  });

  it('should answer for unauthenticated user even when a token is required', async () => {
    // given
    app = await createTestApp(
      { AUTH_MODE: 'token', AUTH_TOKEN: 'secret' },
      { imports: [AuthModule, ServerInfoModule] },
    );

    // when
    const response = await request(app.getHttpServer()).get('/v4/server');

    // then
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      api_version: '4.0.0',
      auth: {
        mode: 'token',
      },
    });
  });
});
