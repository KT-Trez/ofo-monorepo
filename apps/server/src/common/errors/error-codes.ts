import { HttpStatus } from '@nestjs/common';
import type { KeyAsString } from 'type-fest';

/**
 * Registry of the numeric error codes.
 * New codes are only appended at the end of a group; existing ones are never changed or reused.
 */
// oxlint-disable-next-line sort-keys -- kept in the numeric order of the registry
export const ErrorCodes = {
  // 1xxx: general
  unauthorized: {
    code: 1001,
    status: HttpStatus.UNAUTHORIZED,
    title: 'Unauthorized',
  },
  forbidden: {
    code: 1002,
    status: HttpStatus.FORBIDDEN,
    title: 'Forbidden',
  },
  feature_disabled: {
    code: 1003,
    status: HttpStatus.NOT_FOUND,
    title: 'Feature disabled',
  },
  invalid_request: {
    code: 1004,
    status: HttpStatus.BAD_REQUEST,
    title: 'Invalid request',
  },
  rate_limited: {
    code: 1005,
    status: HttpStatus.TOO_MANY_REQUESTS,
    title: 'Too many requests',
  },
  internal_error: {
    code: 1006,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    title: 'Internal server error',
  },
  // 2xxx: media
  unsupported_source: {
    code: 2001,
    status: HttpStatus.BAD_REQUEST,
    title: 'Unsupported source',
  },
  unsupported_format: {
    code: 2002,
    status: HttpStatus.BAD_REQUEST,
    title: 'Unsupported audio format',
  },
  video_unavailable: {
    code: 2010,
    status: HttpStatus.NOT_FOUND,
    title: 'Video unavailable',
  },
  video_private: {
    code: 2011,
    status: HttpStatus.FORBIDDEN,
    title: 'Video is private',
  },
  age_restricted: {
    code: 2012,
    status: HttpStatus.FORBIDDEN,
    title: 'Video is age restricted',
  },
  region_blocked: {
    code: 2013,
    status: HttpStatus.FORBIDDEN,
    title: 'Video is blocked in the server region',
  },
  live_stream_unsupported: {
    code: 2014,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    title: 'Live streams are not supported',
  },
  no_audio_stream: {
    code: 2015,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    title: 'Video has no audio stream',
  },
  upstream_unreachable: {
    code: 2020,
    status: HttpStatus.BAD_GATEWAY,
    title: 'Upstream service unreachable',
  },
  upstream_blocked: {
    code: 2021,
    status: HttpStatus.BAD_GATEWAY,
    title: 'Upstream service blocks the server',
  },
  extractor_outdated: {
    code: 2022,
    status: HttpStatus.BAD_GATEWAY,
    title: 'Extractor is outdated and needs an update',
  },
  conversion_failed: {
    code: 2023,
    status: HttpStatus.BAD_GATEWAY,
    title: 'Audio conversion failed',
  },
  prepare_timeout: {
    code: 2024,
    status: HttpStatus.GATEWAY_TIMEOUT,
    title: 'Preparing the file took too long',
  },
  server_busy: {
    code: 2025,
    status: HttpStatus.SERVICE_UNAVAILABLE,
    title: 'Server is busy',
  },
  storage_full: {
    code: 2026,
    status: HttpStatus.INSUFFICIENT_STORAGE,
    title: 'Storage is full',
  },
  // 3xxx: sync (phase 2)
  cursor_expired: {
    code: 3001,
    status: HttpStatus.GONE,
    title: 'Cursor expired',
  },
  batch_too_large: {
    code: 3002,
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    title: 'Batch too large',
  },
  payload_too_large: {
    code: 3003,
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    title: 'Payload too large',
  },
  hash_mismatch: {
    code: 3004,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    title: 'Content hash mismatch',
  },
  quota_exceeded: {
    code: 3005,
    status: HttpStatus.INSUFFICIENT_STORAGE,
    title: 'Data quota exceeded',
  },
} as const;

export type ErrorCode = (typeof ErrorCodes)[ErrorName]['code'];
export type ErrorDefinition = (typeof ErrorCodes)[ErrorName] & { name: ErrorName };
export type ErrorName = KeyAsString<typeof ErrorCodes>;

const DEFINITIONS: readonly ErrorDefinition[] = (
  Object.entries(ErrorCodes) as [ErrorName, ErrorDefinition][]
).map(([name, definition]) => Object.assign({ name }, definition));

const DEFINITION_BY_NAME = new Map<string, ErrorDefinition>(
  DEFINITIONS.map(item => [item.name, item]),
);
const DEFINITION_BY_CODE = new Map<number, ErrorDefinition>(
  DEFINITIONS.map(item => [item.code, item]),
);

export const getErrorDefinition = (key: ErrorCode | ErrorName): ErrorDefinition => {
  return typeof key === 'number' ? DEFINITION_BY_CODE.get(key)! : DEFINITION_BY_NAME.get(key)!;
};
