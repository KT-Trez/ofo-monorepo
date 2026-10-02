import { type INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { INNER_TUBE_TOKEN } from '../src/inner-tube/inner-tube.module.js';

describe('AppModule (e2e)', () => {
  let app: INestApplication<App>;
  const searchMock = vi
    .fn<(query: string, filters: object) => Promise<{ videos: unknown[] }>>()
    .mockResolvedValue({ videos: [] });
  const innerTubeMock = {
    search: searchMock,
  };

  afterEach(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(INNER_TUBE_TOKEN)
      .useValue(innerTubeMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI });
    await app.init();
  });

  it('GET /v4/search/youtube should return found videos', async () => {
    await request(app.getHttpServer())
      .get('/v4/search/youtube')
      .query({ q: 'q-mock' })
      .expect(200)
      .expect([]);

    expect(searchMock).toHaveBeenCalledWith('q-mock', { type: 'video' });
  });

  it('GET /v4/search/youtube should reject a request without a phrase', async () => {
    await request(app.getHttpServer()).get('/v4/search/youtube').expect(400);

    expect(searchMock).not.toHaveBeenCalled();
  });

  it('GET /v4/search/youtube should reject an invalid filter', async () => {
    await request(app.getHttpServer())
      .get('/v4/search/youtube')
      .query({ duration: 'forever', q: 'q-mock' })
      .expect(400);

    expect(searchMock).not.toHaveBeenCalled();
  });
});
