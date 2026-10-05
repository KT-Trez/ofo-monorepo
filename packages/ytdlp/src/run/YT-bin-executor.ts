import { isAbortError } from '../errors/abort-error.ts';
import { YTErrorKind } from '../errors/types.ts';
import { YTError } from '../errors/YT-error.ts';
import { YTStderr } from '../errors/YT-stderr.ts';
import { YTTimeoutError } from '../errors/YT-timeout-error.ts';
import type { YTOptions } from '../YT.ts';
import { NodeProcessRunner } from './node-process-runner.ts';
import type { ProcessRunner, RunJsonResult, RunOptions, RunResult } from './types.ts';

export type ExecuteOptions = Omit<RunOptions, 'killGraceMs'>;

export class YTBinExecutor {
  static readonly DEFAULT_KILL_GRACE_MS = 5000;

  private readonly baseArgs: string[];
  private readonly binaryPath: string;
  private readonly killGraceMs: number;
  private readonly runner: ProcessRunner;

  constructor(options: Omit<YTOptions, 'timeoutsMs'>) {
    this.baseArgs = [
      '--ignore-config',
      ...(options.jsRuntime ? ['--js-runtimes', options.jsRuntime] : []),
      ...(options.ffmpegPath ? ['--ffmpeg-location', options.ffmpegPath] : []),
      ...(options.extraArgs ?? []),
    ];
    this.binaryPath = options.binaryPath;
    this.killGraceMs = options.killGraceMs ?? YTBinExecutor.DEFAULT_KILL_GRACE_MS;
    this.runner = options.runner ?? new NodeProcessRunner();
  }

  async run(args: string[], options: ExecuteOptions): Promise<RunResult> {
    let result;

    try {
      result = await this.runner.run(this.binaryPath, [...this.baseArgs, ...args], {
        ...options,
        killGraceMs: this.killGraceMs,
      });
    } catch (error) {
      if (isAbortError(error) || error instanceof YTTimeoutError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);

      throw new YTError(YTErrorKind.Unknown, `Cannot run YTDL: "${message}"`, {
        exitCode: null,
        stderr: message,
      });
    }

    if (result.exitCode !== 0) {
      const diagnostics = new YTStderr(result.stderr);
      const message = diagnostics.summarize() ?? `YTDL exited with code "${result.exitCode}"`;

      throw new YTError(diagnostics.classify(), message, {
        exitCode: result.exitCode,
        stderr: result.stderr,
      });
    }

    return result;
  }

  async runJson(args: string[], options: ExecuteOptions): Promise<RunJsonResult> {
    const { stderr, stdout } = await this.run(args, options);

    try {
      return { json: JSON.parse(stdout), stderr };
    } catch {
      throw new YTError(YTErrorKind.Unknown, 'YTDL returned invalid JSON', {
        exitCode: 0,
        stderr,
      });
    }
  }
}
