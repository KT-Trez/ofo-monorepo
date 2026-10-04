import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createTestApp } from '../../test/core/create-test-app.ts';
import { HealthModule } from './health.module.ts';

describe('HealthController', () => {
  let app: NestExpressApplication | undefined;

  afterEach(async () => {
    await app?.close();
  });

  it('should run no liveness checks', async () => {
    // given
    app = await createTestApp(
      {},
      {
        imports: [HealthModule],
      },
    );

    // when
    const response = await request(app.getHttpServer()).get('/v4/health/live');

    // then
    expect(response.body).toEqual({
      details: {},
      error: {},
      info: {},
      status: 'ok',
    });
  });

  it('should run disk, heap and registered readiness checks', async () => {
    // given
    app = await createTestApp(
      {},
      {
        imports: [HealthModule],
      },
    );

    // when
    const response = await request(app.getHttpServer()).get('/v4/health/ready');

    // then
    expect(response.body).toEqual({
      details: {
        disk: {
          status: 'up',
        },
        memory_heap: {
          status: 'up',
        },
      },
      error: {},
      info: {
        disk: {
          status: 'up',
        },
        memory_heap: {
          status: 'up',
        },
      },
      status: 'ok',
    });
  });
});
