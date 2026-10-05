/**
 * Minimal process runner abstraction. Allows to substitute the runner for testing purposes.
 */
export type ProcessRunner = {
  isExecutable(command: string): boolean;
  run(command: string, args: string[], options: RunOptions): Promise<RunResult>;
};

export type RunOptions = {
  killGraceMs: number;
  signal?: AbortSignal;
  timeoutMs: number;
};

export type RunResult = {
  exitCode: number;
  stderr: string;
  stdout: string;
};

export type RunJsonResult = {
  json: unknown;
  stderr: string;
};
