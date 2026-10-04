import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Problem } from '@ofo/server-contract';
import type { Response } from 'express';
import { STATUS_CODES } from 'node:http';
import { ApiException } from './api-exception.js';
import { ErrorCodes, type ErrorName } from './error-codes.js';

type NormalizedException = {
  problem: Problem;
  retryAfterSec?: number;
};

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  public static readonly PROBLEM_CONTENT_TYPE = 'application/problem+json';
  public static readonly STATUS_TO_ERROR: Record<number, ErrorName> = {
    400: 'invalid_request',
    401: 'unauthorized',
    403: 'forbidden',
    // the registry has no generic "not found": an unknown route is reported as an invalid request
    404: 'invalid_request',
    413: 'invalid_request',
    415: 'invalid_request',
    429: 'rate_limited',
  };

  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    // the client closed the connection, return early
    if (res.destroyed) {
      return;
    }

    const { problem, retryAfterSec } = this.normalize(exception);

    if (problem.status >= 500) {
      const message = `${problem.code} ${problem.title}${problem.detail ? `: ${problem.detail}` : ''}`;
      const stack = exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(message, stack);
    }

    if (res.headersSent) {
      // streaming already started, a body cannot be written anymore
      if (!res.writableEnded) {
        res.destroy(exception instanceof Error ? exception : undefined);
      }

      return;
    }

    res.setHeader('Content-Type', ExceptionsFilter.PROBLEM_CONTENT_TYPE);

    if (retryAfterSec !== undefined) {
      res.setHeader('Retry-After', String(retryAfterSec));
    }

    // a "Buffer" body keeps the "Content-Type" as set
    res.status(problem.status).send(Buffer.from(JSON.stringify(problem)));
  }

  private adaptHttpError(exception: unknown): unknown {
    const isError = exception instanceof Error;
    const isHttpException = exception instanceof HttpException;

    if (isError && !isHttpException) {
      const { expose, status } = exception as { expose?: unknown; status?: unknown };

      if (expose === true && typeof status === 'number' && status >= 400 && status < 500) {
        return new HttpException(exception.message, status, { cause: exception });
      }
    }

    return exception;
  }

  private normalize(rawException: unknown): NormalizedException {
    const exception = this.adaptHttpError(rawException);

    if (exception instanceof ApiException) {
      const { code, status, title } = exception.definition;

      return {
        problem: {
          code,
          ...(exception.detail !== undefined && { detail: exception.detail }),
          status,
          title,
          type: 'about:blank',
        },
        retryAfterSec: exception.retryAfterSec,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      const errorNameFromStatus = ExceptionsFilter.STATUS_TO_ERROR[status];
      const errorNameFallback = status >= 500 ? 'internal_error' : 'invalid_request';

      const { code } = ErrorCodes[errorNameFromStatus ?? errorNameFallback];
      const detail = this.readDetail(exception);
      const title = STATUS_CODES[status] ?? ErrorCodes.internal_error.title;

      return {
        problem: {
          code,
          ...(detail !== undefined && detail !== title && { detail }),
          status,
          title,
          type: 'about:blank',
        },
      };
    }

    const { code, status, title } = ErrorCodes.internal_error;

    return {
      problem: {
        code,
        status,
        title,
        type: 'about:blank',
      },
    };
  }

  private readDetail(exception: HttpException): string | undefined {
    const response = exception.getResponse();

    const isObject = typeof response === 'object';
    const isNotNull = response !== null;
    const hasMessage = isObject && isNotNull && 'message' in response;

    const message = hasMessage ? response.message : response;

    // ValidationPipe reports an array of messages
    if (Array.isArray(message)) {
      return message.join('; ');
    }

    return typeof message === 'string' ? message : exception.message;
  }
}
