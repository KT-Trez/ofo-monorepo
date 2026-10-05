import { type ChildProcess, spawn } from 'node:child_process';
import { accessSync, constants, statSync } from 'node:fs';
import { delimiter, join, sep } from 'node:path';
import type { Readable } from 'node:stream';
import { createAbortError } from '../errors/abort-error.ts';
import { YTTimeoutError } from '../errors/YT-timeout-error.ts';
import type { ProcessRunner, RunOptions, RunResult } from './types.ts';

type Stream = 'stderr' | 'stdout';

export class NodeProcessRunner implements ProcessRunner {
  private static isExecutableFile(path: string): boolean {
    try {
      // directories carry the executable bit too
      if (!statSync(path).isFile()) {
        return false;
      }

      accessSync(path, constants.X_OK);

      return true;
    } catch {
      return false;
    }
  }

  isExecutable(command: string): boolean {
    if (command.includes(sep) || command.includes('/')) {
      return NodeProcessRunner.isExecutableFile(command);
    }

    const isWindows = process.platform === 'win32';

    const extensions = isWindows ? ['', ...(process.env.PATHEXT ?? '.EXE').split(';')] : [''];
    const dirs = (process.env.PATH ?? '').split(delimiter).filter(Boolean);

    return dirs.some(dir => {
      return extensions.some(extension => {
        return NodeProcessRunner.isExecutableFile(join(dir, command + extension));
      });
    });
  }

  run(command: string, args: string[], options: RunOptions): Promise<RunResult> {
    return new ChildProcessRunner(command, args, options).start();
  }
}

class ChildProcessRunner {
  private readonly args: string[];
  private readonly command: string;
  private readonly options: RunOptions;
  private readonly output: Record<Stream, string> = { stderr: '', stdout: '' };
  // own process group, so ffmpeg children die together with yt-dlp
  private readonly useGroup = process.platform !== 'win32';

  private child: ChildProcess | undefined;
  private killTimer: NodeJS.Timeout | undefined;
  private stopReason: 'abort' | 'timeout' | null = null;
  private timeoutTimer: NodeJS.Timeout | undefined;

  constructor(command: string, args: string[], options: RunOptions) {
    this.args = args;
    this.command = command;
    this.options = options;
  }

  start(): Promise<RunResult> {
    const { signal, timeoutMs } = this.options;

    return new Promise<RunResult>((resolve, reject) => {
      if (signal?.aborted) {
        return reject(createAbortError(signal));
      }

      const child = spawn(this.command, this.args, {
        detached: this.useGroup,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      this.child = child;

      this.timeoutTimer = setTimeout(this.onTimeout.bind(this), timeoutMs);
      signal?.addEventListener('abort', this.onAbort.bind(this), { once: true });

      this.collect(child.stdout, 'stdout');
      this.collect(child.stderr, 'stderr');

      this.child
        .once('error', error => {
          this.cleanup();
          reject(error);
        })
        .once('close', code => {
          this.cleanup();

          if (this.stopReason === 'abort') {
            return reject(createAbortError(signal));
          }

          if (this.stopReason === 'timeout') {
            return reject(new YTTimeoutError(timeoutMs));
          }

          resolve({ exitCode: code ?? -1, stderr: this.output.stderr, stdout: this.output.stdout });
        });
    });
  }

  private cleanup(): void {
    clearTimeout(this.killTimer);
    clearTimeout(this.timeoutTimer);
    this.options.signal?.removeEventListener('abort', this.onAbort);
  }

  private collect(stream: Readable, name: Stream): void {
    stream.setEncoding('utf8');
    stream.on('data', (chunk: string) => {
      this.output[name] += chunk;
    });
  }

  private onAbort() {
    this.stop('abort');
  }

  private onTimeout() {
    this.stop('timeout');
  }

  private signalProcess(name: NodeJS.Signals): void {
    try {
      if (this.useGroup && this.child?.pid !== undefined) {
        process.kill(-this.child.pid, name);
      } else {
        this.child?.kill(name);
      }
    } catch {
      // already gone
    }
  }

  private stop(reason: 'abort' | 'timeout'): void {
    if (this.stopReason) {
      return;
    }

    this.stopReason = reason;
    this.signalProcess('SIGTERM');
    this.killTimer = setTimeout(() => this.signalProcess('SIGKILL'), this.options.killGraceMs);
  }
}
