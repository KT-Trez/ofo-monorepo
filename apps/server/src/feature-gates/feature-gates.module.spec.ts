import { Controller, Get, Module } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createTestApp } from '../../test/core/create-test-app.ts';
import { FeatureGatesModule } from './feature-gates.module.js';

@Controller({ path: 'media/ping', version: '4' })
class MediaPingController {
  @Get()
  ping() {
    return { ok: true };
  }
}

@Module({ controllers: [MediaPingController] })
class FakeMediaModule {}

@Controller({ path: 'sync/ping', version: '4' })
class SyncPingController {
  @Get()
  ping() {
    return { ok: true };
  }
}

@Module({ controllers: [SyncPingController] })
class FakeSyncModule {}

describe('FeatureGatesModule', () => {
  let app: NestExpressApplication | undefined;

  afterEach(async () => {
    await app?.close();
  });

  it.for<[url: string, module: 'media' | 'sync']>([
    ['/v4/media', 'media'],
    ['/v4/media/search?q=x', 'media'],
    ['/v4/media/youtube/dQw4w9WgXcQ/audio', 'media'],
    ['/v4/sync', 'sync'],
    ['/v4/sync/changes', 'sync'],
  ])('should answer 404 on "%s" when media is disabled', async ([url, disabledModule]) => {
    // given
    app = await createTestApp(
      {
        MEDIA_ENABLED: String(disabledModule !== 'media'),
        SYNC_ENABLED: String(disabledModule !== 'sync'),
      },
      { imports: [FeatureGatesModule] },
    );

    // when
    const response = await request(app.getHttpServer()).get(url);

    // then
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toBe('application/problem+json');
    expect(response.body).toEqual({
      code: 1003,
      detail: `The "${disabledModule}" feature is disabled on this server`,
      status: 404,
      title: 'Feature disabled',
      type: 'about:blank',
    });
  });

  it('should not intercept /v4/media/* when media is enabled', async () => {
    // given
    app = await createTestApp(
      { MEDIA_ENABLED: 'true' },
      { imports: [FeatureGatesModule, FakeMediaModule] },
    );

    // when
    const response = await request(app.getHttpServer()).get('/v4/media/ping');

    // then
    expect(response.status).toBe(200);
  });

  // oxlint-disable-next-line vitest/no-disabled-tests
  it.skip('should not intercept /v4/sync/* when sync is enabled', async () => {
    // given
    app = await createTestApp(
      { SYNC_ENABLED: 'true' },
      { imports: [FeatureGatesModule, FakeSyncModule] },
    );

    // when
    const response = await request(app.getHttpServer()).get('/v4/sync/ping');

    // then
    expect(response.status).toBe(200);
  });

  it('should keep unknown routes as plain 404 problems', async () => {
    // given
    app = await createTestApp({}, { imports: [FeatureGatesModule] });

    // when
    const response = await request(app.getHttpServer()).get('/v4/nothing');

    // then
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: 1004,
      detail: 'Cannot GET /v4/nothing',
      status: 404,
      title: 'Not Found',
      type: 'about:blank',
    });
  });
});
