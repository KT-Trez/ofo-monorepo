import {
  type ErrorCode,
  type ErrorDefinition,
  type ErrorName,
  getErrorDefinition,
} from './error-codes.js';

export type ApiExceptionOptions = {
  /** Not serialized, kept for the logs. */
  cause?: unknown;
  /** Sets the `Retry-After` header (e.g. for 2025 server_busy). */
  retryAfterSec?: number;
};

/** Error with a numeric code from the registry (see `error-codes.ts`), rendered as problem+json. */
export class ApiException extends Error {
  public readonly definition: ErrorDefinition;
  public readonly detail?: string;
  public readonly retryAfterSec?: number;

  /**
   * @param key numeric code or registry name
   * @param detail human readable explanation specific to this occurrence (English)
   * @param options optional metadata
   */
  constructor(key: ErrorCode | ErrorName, detail?: string, options?: ApiExceptionOptions) {
    const definition = getErrorDefinition(key);
    super(detail ?? definition.title, { cause: options?.cause });

    this.definition = definition;
    this.detail = detail;
    this.name = 'ApiException';
    this.retryAfterSec = options?.retryAfterSec;
  }

  get code(): ErrorCode {
    return this.definition.code;
  }
}
