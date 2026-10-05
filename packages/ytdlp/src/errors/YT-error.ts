import type { YTErrorKinds } from './types.ts';

export type YTErrorOptions = {
  exitCode: number | null;
  stderr: string;
};

export class YTError extends Error {
  readonly exitCode: number | null;
  readonly kind: YTErrorKinds;
  readonly stderr: string;

  constructor(kind: YTErrorKinds, message: string, options: YTErrorOptions) {
    super(message);

    this.exitCode = options.exitCode;
    this.kind = kind;
    this.name = 'YTError';
    this.stderr = options.stderr;
  }
}
