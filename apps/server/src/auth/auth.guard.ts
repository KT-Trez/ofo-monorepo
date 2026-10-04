import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { ServerConfig } from '../../config/configuration.js';
import { ApiException } from '../common/errors/api-exception.js';
import { IS_PUBLIC_PATH_FLAG } from './auth.constants.ts';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly BEARER_PATTERN = /^Bearer\s+(\S+)$/i;

  constructor(
    private readonly config: ConfigService<ServerConfig>,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_PATH_FLAG, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const auth = this.config.getOrThrow('auth', { infer: true });

    if (auth.mode === 'none') {
      return true;
    }

    if (auth.mode === 'token') {
      const request = context.switchToHttp().getRequest<Request>();
      const authorization = request.headers.authorization;

      if (!authorization) {
        throw new ApiException('unauthorized', 'Missing or invalid bearer token');
      }

      const token = AuthGuard.BEARER_PATTERN.exec(authorization)?.at(1);

      if (token && auth.token && this.itTokenMatching(token, auth.token)) {
        return true;
      }

      throw new ApiException('unauthorized', 'Missing or invalid bearer token');
    }

    throw new ApiException('unauthorized');
  }

  private itTokenMatching(actual: string, expected: string) {
    return timingSafeEqual(this.toSha256(actual), this.toSha256(expected));
  }

  private toSha256(value: string) {
    return createHash('sha256').update(value).digest();
  }
}
