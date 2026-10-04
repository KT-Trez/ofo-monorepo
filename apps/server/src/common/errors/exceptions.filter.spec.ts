import {
  type ArgumentsHost,
  BadRequestException,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type {
  HttpArgumentsHost,
} from '@nestjs/common/interfaces/features/arguments-host.interface.d.ts';
import { noop } from 'es-toolkit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiException } from './api-exception.js';
import { ExceptionsFilter } from './exceptions.filter.js';

describe('ExceptionsFilter', () => {
  const filter = new ExceptionsFilter();

  const setup = (headersSent = false) => {
    const headers: Record<string, string> = {};

    const response = {
      destroy: vi.fn<(error?: Error) => void>(),
      headersSent: headersSent,
      send: vi.fn<(body: Buffer) => void>(),
      setHeader: vi.fn<(name: string, value: string) => void>((name, value) => {
        headers[name] = value;
      }),
      status: vi.fn<(code: number) => unknown>().mockReturnThis(),
      writableEnded: false,
    };

    const host = {
      switchToHttp: () => {
        return {
          getRequest: () => ({ headers: {} }),
          getResponse: () => response,
        } as HttpArgumentsHost;
      },
    } as ArgumentsHost;

    const body = (): unknown => JSON.parse(String(response.send.mock.calls[0]![0]));

    return {
      body,
      headers,
      host,
      response,
    };
  };

  beforeEach(() => {
    vi.spyOn(Logger.prototype, 'error').mockImplementation(noop);
  });

  it('should return an ApiException as problem+json with its numeric code', () => {
    // given
    const { body, host, response, headers } = setup();
    const exception = new ApiException(2011, 'The video is private');

    // when
    filter.catch(exception, host);

    // then
    expect(response.status).toHaveBeenCalledWith(403);
    expect(headers['Content-Type']).toBe(ExceptionsFilter.PROBLEM_CONTENT_TYPE);
    expect(body()).toEqual({
      code: 2011,
      detail: 'The video is private',
      status: 403,
      title: 'Video is private',
      type: 'about:blank',
    });
  });

  it('should accept an error name and omit the detail when none is given', () => {
    // given
    const { body, host, response } = setup();

    // when
    filter.catch(new ApiException('feature_disabled'), host);

    // then
    expect(response.status).toHaveBeenCalledWith(404);
    expect(body()).toEqual({
      code: 1003,
      status: 404,
      title: 'Feature disabled',
      type: 'about:blank',
    });
  });

  it('should set the "Retry-After" from "ApiException.retryAfterSec"', () => {
    // given
    const { body, host, response, headers } = setup();

    // when
    filter.catch(new ApiException(2025, undefined, { retryAfterSec: 30 }), host);

    // then
    expect(response.status).toHaveBeenCalledWith(503);
    expect(headers['Retry-After']).toBe('30');
    expect(body()).toMatchObject({ code: 2025 });
  });

  it('should return nothing when the client has already gone', () => {
    // given
    const { host, response } = setup();
    Object.assign(response, { destroyed: true });

    // when
    filter.catch(new Error('aborted'), host);

    // then
    expect(Logger.prototype.error).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(response.send).not.toHaveBeenCalled();
  });

  it('should map validation error to 1004 and join the messages', () => {
    // given
    const { body, host, response } = setup();
    const exception = new BadRequestException(['q should not be empty', 'limit must be a number']);

    // when
    filter.catch(exception, host);

    // then
    expect(response.status).toHaveBeenCalledWith(400);
    expect(body()).toEqual({
      code: 1004,
      detail: 'q should not be empty; limit must be a number',
      status: 400,
      title: 'Bad Request',
      type: 'about:blank',
    });
  });

  it('should omit the detail when it only repeats the title', () => {
    // given
    const { body, host } = setup();

    // when
    filter.catch(new NotFoundException(), host);

    // then
    expect(body()).not.toHaveProperty('detail');
  });

  it.each([
    [401, 1001],
    [403, 1002],
    [404, 1004],
    [413, 1004],
    [415, 1004],
    [429, 1005],
    [418, 1004],
    [503, 1006],
  ])('should map HTTP "%i" to code "%i"', (status, code) => {
    // given
    const { body, host, response } = setup();

    // when
    filter.catch(new HttpException('x', status), host);

    // then
    expect(response.status).toHaveBeenCalledWith(status);
    expect(body()).toMatchObject({ code, status });
  });

  it('should adapt http-errors thrown by middleware', () => {
    // given
    const { body, host, response } = setup();
    const error = Object.assign(new Error('request entity too large'), {
      expose: true,
      status: 413,
    });

    // when
    filter.catch(error, host);

    // then
    expect(response.status).toHaveBeenCalledWith(413);
    expect(body()).toMatchObject({ code: 1004, status: 413 });
  });

  it('should hide internals of unknown errors and log the stack', () => {
    // given
    const { body, host, response } = setup();
    const error = new Error('db password leaked');

    // when
    filter.catch(error, host);

    // then
    expect(response.status).toHaveBeenCalledWith(500);
    expect(body()).toEqual({
      code: 1006,
      status: 500,
      title: 'Internal server error',
      type: 'about:blank',
    });

    expect(JSON.stringify(body())).not.toContain('leaked');
    expect(Logger.prototype.error).toHaveBeenCalledWith(expect.any(String), error.stack);
  });

  it('should not write a body when headers were already sent', () => {
    // given
    const { host, response } = setup(true);

    // when
    filter.catch(new ApiException(2023), host);

    // then
    expect(response.send).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(response.destroy).toHaveBeenCalled();
  });
});
