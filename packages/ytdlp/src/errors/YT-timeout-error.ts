export class YTTimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`YT did not finish within ${timeoutMs}ms`);

    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}
