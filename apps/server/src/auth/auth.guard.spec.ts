import { Controller, Get } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createTestApp } from '../../test/core/create-test-app.ts';
import { AuthPublic } from './auth-public.decorator.ts';
import { AuthModule } from './auth.module.js';

@Controller({ path: 'probe', version: '4' })
class FakeController {
  @Get('private')
  private() {
    return { ok: true };
  }

  @AuthPublic()
  @Get('public')
  public() {
    return { ok: true };
  }
}

describe('AuthGuard', () => {
  let app: NestExpressApplication | undefined;

  afterEach(async () => {
    await app?.close();
  });

  describe('"none" mode', () => {
    const env: Record<string, string> = {
      AUTH_MODE: 'none',
    };

    it('should allow everything in the none mode', async () => {
      // given
      app = await createTestApp(env, { controllers: [FakeController], imports: [AuthModule] });

      // when
      const response = await request(app.getHttpServer()).get('/v4/probe/private');

      // then
      expect(response.status).toBe(200);
    });
  });

  describe('"oidc" mode', () => {
    const env: Record<string, string> = {
      AUTH_MODE: 'oidc',
    };

    it('should fail closed for the not implemented mode', async () => {
      // given
      app = await createTestApp(env, { controllers: [FakeController], imports: [AuthModule] });

      // when
      const response = await request(app.getHttpServer())
        .get('/v4/probe/private')
        .set('Authorization', 'Bearer anything');

      // then
      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({ code: 1001, status: 401 });
    });
  });

  describe('"token" mode', () => {
    const env: Record<string, string> = {
      AUTH_MODE: 'token',
      AUTH_TOKEN: 'secret-token',
    };

    it('should allow a valid bearer token', async () => {
      // given
      app = await createTestApp(env, { controllers: [FakeController], imports: [AuthModule] });

      // when
      const response = await request(app.getHttpServer())
        .get('/v4/probe/private')
        .set('Authorization', `Bearer ${env.AUTH_TOKEN}`);

      // then
      console.log(response.body);
      expect(response.status).toBe(200);
    });

    it('should reject a missing token with 401 problem+json code 1001', async () => {
      // given
      app = await createTestApp(env, { controllers: [FakeController], imports: [AuthModule] });

      // when
      const response = await request(app.getHttpServer()).get('/v4/probe/private');

      // then
      expect(response.status).toBe(401);
      expect(response.headers['content-type']).toBe('application/problem+json');
      expect(response.body).toMatchObject({
        code: 1001,
        detail: 'Missing or invalid bearer token',
        status: 401,
      });
    });

    it.each([
      ['Bearer wrong-token'],
      [`Bearer ${env.AUTH_TOKEN}-and-more`],
      [`Basic ${env.AUTH_TOKEN}`],
      [`${env.AUTH_TOKEN}`],
      ['Bearer '],
    ])('should reject the Authorization header "%s"', async header => {
      // given
      app = await createTestApp(env, { controllers: [FakeController], imports: [AuthModule] });

      // when
      const response = await request(app.getHttpServer())
        .get('/v4/probe/private')
        .set('Authorization', header);

      // then
      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        code: 1001,
        detail: 'Missing or invalid bearer token',
        status: 401,
      });
    });

    it('should not require a token on public routes', async () => {
      // given
      app = await createTestApp(env, { controllers: [FakeController], imports: [AuthModule] });

      // when
      const response = await request(app.getHttpServer()).get('/v4/probe/public');

      // then
      expect(response.status).toBe(200);
    });
  });
});
