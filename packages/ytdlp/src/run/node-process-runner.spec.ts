import { chmod, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isAbortError } from '../errors/abort-error.ts';
import { YTTimeoutError } from '../errors/YT-timeout-error.ts';
import { NodeProcessRunner } from './node-process-runner.ts';
import type { RunOptions } from './types.ts';

describe('NodeProcessRunner', () => {
  const defaultOptions: RunOptions = { killGraceMs: 200, timeoutMs: 10_000 };
  const runner = new NodeProcessRunner();

  const createRunner = (script: string, options?: Partial<RunOptions>) => {
    return runner.run(process.execPath, ['-e', script], { ...defaultOptions, ...options });
  };

  it('should collect stdout, stderr and a non-zero exit code', async () => {
    // given
    const script = ['console.log("out");', 'console.error("err");', 'process.exit(3)'].join(' ');

    // when
    const result = await createRunner(script);

    // then
    expect(result).toEqual({ exitCode: 3, stderr: 'err\n', stdout: 'out\n' });
  });

  it('should reject with an AbortError and kill the process on abort', async () => {
    // given
    const controller = new AbortController();
    const started = Date.now();
    const script = 'setInterval(() => {}, 1000)';

    // when
    const promise = createRunner(script, { signal: controller.signal });
    setTimeout(() => controller.abort(), 100);

    // then
    const error = await promise.catch((caught: unknown) => caught);

    expect(isAbortError(error)).toBe(true);
    expect(Date.now() - started).toBeLessThan(5000);
  });

  it('should escalate to SIGKILL when the process ignores SIGTERM', async () => {
    // given
    const controller = new AbortController();
    const script = [
      'process.on("SIGTERM", () => {});',
      'console.log("ready");',
      'setInterval(() => {}, 1000)',
    ].join('');

    // when
    const promise = createRunner(script, { signal: controller.signal });
    setTimeout(() => controller.abort(), 100);

    // then
    const error = await promise.catch((caught: unknown) => caught);
    expect(isAbortError(error)).toBe(true);
  });

  it('should reject immediately for an already aborted signal', async () => {
    // given
    const controller = new AbortController();
    controller.abort();
    const script = 'setInterval(() => {}, 1000)';

    // when
    const promise = createRunner(script, { signal: controller.signal });

    // then
    const error = await promise.catch((caught: unknown) => caught);
    expect(isAbortError(error)).toBe(true);
  });

  it('should reject with YTTimeoutError when the timeout elapses', async () => {
    // given
    const script = 'setInterval(() => {}, 1000)';

    // when
    const promise = createRunner(script, { timeoutMs: 100 });

    // then
    const error = await promise.catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(YTTimeoutError);
  });

  it('should reject when the binary does not exist', async () => {
    // given / when
    const promise = runner.run('/nonexistent/yt-dlp', [], defaultOptions);

    // then
    await expect(promise).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('should tell executable files apart', async () => {
    // given
    const dir = await mkdtemp(join(tmpdir(), 'runner-exec-'));
    const executable = join(dir, 'tool');
    const plain = join(dir, 'plain');
    await writeFile(executable, '');
    await chmod(executable, 0o755);
    await writeFile(plain, '');
    await chmod(plain, 0o644);

    try {
      // when / then
      expect(runner.isExecutable(executable)).toBe(true);
      expect(runner.isExecutable(plain)).toBe(false);
      expect(runner.isExecutable(dir)).toBe(false);
      expect(runner.isExecutable(join(dir, 'missing'))).toBe(false);
    } finally {
      await rm(dir, { force: true, recursive: true });
    }
  });

  it('should look bare names up in PATH', () => {
    // given / when / then
    expect(runner.isExecutable('node')).toBe(true);
    expect(runner.isExecutable('surely-not-a-real-binary-ofo')).toBe(false);
  });
});
