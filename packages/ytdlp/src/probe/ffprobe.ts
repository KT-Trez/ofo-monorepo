import { isAbortError } from '../errors/abort-error.ts';
import type { ProcessRunner } from '../run/types.ts';
import type { ProbeResult } from './types.ts';

type FFprobeOptions = {
  binaryPath: string;
  killGraceMs: number;
  runner: ProcessRunner;
  timeoutMs: number;
};

export class FFprobe {
  private readonly binaryPath: string;
  private readonly killGraceMs: number;
  private readonly runner: ProcessRunner;
  private readonly timeoutMs: number;

  constructor(options: FFprobeOptions) {
    this.binaryPath = options.binaryPath;
    this.killGraceMs = options.killGraceMs;
    this.runner = options.runner;
    this.timeoutMs = options.timeoutMs;
  }

  private static args(path: string): string[] {
    return [
      '-v',
      'error',
      '-select_streams',
      'a:0',
      '-show_entries',
      'format=duration:stream=duration',
      '-of',
      'json',
      path,
    ];
  }

  private static parseDurationMs(json: string): number | null {
    let parsed: ProbeResult;

    try {
      parsed = JSON.parse(json);
    } catch {
      return null;
    }

    const durationOnContainer = parsed?.format?.duration;
    const durationOnStream = parsed?.streams?.[0]?.duration;
    const duration = durationOnContainer ?? durationOnStream ?? Number.NaN;
    const seconds = Number(duration);

    return Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds * 1000) : null;
  }

  /**
   * @throws AbortError on `signal` abort
   */
  async durationMs(path: string, signal?: AbortSignal): Promise<number | null> {
    let result;

    try {
      result = await this.runner.run(this.binaryPath, FFprobe.args(path), {
        killGraceMs: this.killGraceMs,
        signal,
        timeoutMs: this.timeoutMs,
      });
    } catch (error: unknown) {
      if (isAbortError(error)) {
        throw error;
      }

      return null;
    }

    return result.exitCode === 0 ? FFprobe.parseDurationMs(result.stdout) : null;
  }
}
