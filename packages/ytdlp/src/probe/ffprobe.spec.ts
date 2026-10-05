import { describe, expect, it } from 'vitest';
import { isAbortError } from '../errors/abort-error.ts';
import type { ProcessRunner, RunResult } from '../run/types.ts';
import { FFprobe } from './ffprobe.ts';

describe('FFprobe.durationMs', () => {
  const createProbe = (
    run: (args: string[]) => Promise<Partial<RunResult>> | Partial<RunResult>,
  ) => {
    const runner: ProcessRunner = {
      isExecutable: () => true,
      async run(_command, args) {
        return { exitCode: 0, stderr: '', stdout: '', ...(await run(args)) };
      },
    };

    return new FFprobe({ binaryPath: '/bin/ffprobe', killGraceMs: 10, runner, timeoutMs: 100 });
  };

  it('should ask only for the durations of the container and the first audio stream', async () => {
    // given
    let probed: string[] = [];

    const ffprobe = createProbe(args => {
      probed = args;

      return {};
    });

    // when
    await ffprobe.durationMs('/a.mp3');

    // then
    expect(probed).toEqual([
      '-v',
      'error',
      '-select_streams',
      'a:0',
      '-show_entries',
      'format=duration:stream=duration',
      '-of',
      'json',
      '/a.mp3',
    ]);
  });

  it('should prefer the container duration', async () => {
    // given
    const stdout = JSON.stringify({
      format: { duration: '212.345000' },
      streams: [{ duration: '212.1' }],
    });

    // when
    const result = await createProbe(() => ({ stdout })).durationMs('/a.mp3');

    // then
    expect(result).toBe(212_345);
  });

  it('should fall back to the audio stream duration', async () => {
    // given
    const stdout = JSON.stringify({
      format: {},
      streams: [{ duration: '3.5' }],
    });

    // when
    const result = await createProbe(() => ({ stdout })).durationMs('/a.mp3');

    // then
    expect(result).toBe(3500);
  });

  it.for(['not json', '{}', 'null', JSON.stringify({ format: { duration: '0' } })] as const)(
    'should return null when there is no usable duration: "%s"',
    async stdout => {
      // when
      const result = await createProbe(() => ({ stdout })).durationMs('/a.mp3');

      // then
      expect(result).toBeNull();
    },
  );

  it('should return null when ffprobe fails', async () => {
    // given
    const stdout = JSON.stringify({ format: { duration: '1' } });

    // when
    const result = await createProbe(() => ({ exitCode: 1, stdout })).durationMs('/a.mp3');

    // then
    expect(result).toBeNull();
  });

  it('should return null when ffprobe does not exist', async () => {
    // when
    const result = await createProbe(() => {
      throw new Error('spawn ENOENT');
    }).durationMs('/a.mp3');

    // then
    expect(result).toBeNull();
  });

  it('should let aborts through', async () => {
    // given
    const ffprobe = createProbe(() => {
      throw new DOMException('aborted', 'AbortError');
    });

    // when
    const error = await ffprobe.durationMs('/a.mp3').catch((e: unknown) => e);

    // then
    expect(isAbortError(error)).toBe(true);
  });
});
