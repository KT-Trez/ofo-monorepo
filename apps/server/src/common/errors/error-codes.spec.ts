import { describe, expect, it } from 'vitest';
import { ErrorCodes } from './error-codes.ts';

describe('ERROR_CODES', () => {
  it('should list unique numeric codes in the documented ranges', () => {
    // given
    const codes = Object.values(ErrorCodes).map(item => item.code);

    // then
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).toEqual([
      1001, 1002, 1003, 1004, 1005, 1006, 2001, 2002, 2010, 2011, 2012, 2013, 2014, 2015, 2020,
      2021, 2022, 2023, 2024, 2025, 2026, 3001, 3002, 3003, 3004, 3005,
    ]);
  });

  it.each([
    ['unauthorized', 401],
    ['feature_disabled', 404],
    ['unsupported_format', 400],
    ['live_stream_unsupported', 422],
    ['conversion_failed', 502],
    ['prepare_timeout', 504],
    ['server_busy', 503],
    ['storage_full', 507],
    ['cursor_expired', 410],
    ['hash_mismatch', 422],
  ] as const)('should map "%s" to HTTP "%i" code', (name, status) => {
    expect(ErrorCodes[name].status).toBe(status);
  });
});
