import type { YTErrorKinds } from '@ofo/ytdlp/errors/types';
import { YTError } from '@ofo/ytdlp/errors/YT-error';
import { YTTimeoutError } from '@ofo/ytdlp/errors/YT-timeout-error';
import { describe, expect, it } from 'vitest';
import { ApiException } from '../common/errors/api-exception.js';
import { mapWdlError } from './wdl-error.mapper.ts';

describe('mapWdlError', () => {
  const createYTError = (kind: YTErrorKinds) => {
    return new YTError(kind, 'failed', { exitCode: 1, stderr: '' });
  };

  const codeOf = (error: unknown) => (error instanceof ApiException ? error.code : -1);

  it.each([
    ['video_unavailable', 2010],
    ['video_private', 2011],
    ['age_restricted', 2012],
    ['region_blocked', 2013],
    ['live_stream', 2014],
    ['no_audio', 2015],
    ['network', 2020],
    ['blocked', 2021],
    ['extractor_outdated', 2022],
    ['conversion', 2023],
    ['unknown', 1006],
  ] as const)('should map the "%s" kind to %i', (kind, code) => {
    // given
    const error = createYTError(kind);

    // when
    const exception = mapWdlError(error, 'download');

    // then
    expect(exception).toBeInstanceOf(ApiException);
    expect(codeOf(exception)).toBe(code);
    expect(exception.cause).toBe(error);
  });

  it('should map a download timeout to 2024', () => {
    expect(codeOf(mapWdlError(new YTTimeoutError(1000), 'download'))).toBe(2024);
  });

  it('should map a search timeout to 2020', () => {
    expect(codeOf(mapWdlError(new YTTimeoutError(1000), 'search'))).toBe(2020);
  });

  it('should keep an ApiException and an AbortError untouched', () => {
    // given
    const api = new ApiException('server_busy');
    const abort = new DOMException('aborted', 'AbortError');

    // when / then
    expect(mapWdlError(api, 'download')).toBe(api);
    expect(mapWdlError(abort, 'download')).toBe(abort);
  });

  it('should map anything else to 1006', () => {
    expect(codeOf(mapWdlError(new Error('boom'), 'download'))).toBe(1006);
    expect(codeOf(mapWdlError('weird', 'download'))).toBe(1006);
  });
});
