export function createAbortError(signal?: AbortSignal): Error {
  const reason: unknown = signal?.reason;

  if (reason instanceof Error && reason.name === 'AbortError') {
    return reason;
  }

  return new DOMException('The operation was aborted', 'AbortError');
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}
