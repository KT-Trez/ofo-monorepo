import { stat } from 'node:fs/promises';
import { YTErrorKind } from '../errors/types.ts';
import { YTError } from '../errors/YT-error.ts';
import { YTStderr } from '../errors/YT-stderr.ts';
import type { FFprobe } from '../probe/ffprobe.ts';
import type { YTBinExecutor } from '../run/YT-bin-executor.ts';
import { DownloadTarget } from './download-target.ts';
import type { DownloadOptions, DownloadResult } from './types.ts';

type AudioDownloaderOptions = {
  executor: YTBinExecutor;
  ffprobe: FFprobe;
  timeoutMs: number;
};

export class AudioDownloader {
  private readonly executor: YTBinExecutor;
  private readonly ffprobe: FFprobe;
  private readonly timeoutMs: number;

  constructor(options: AudioDownloaderOptions) {
    this.executor = options.executor;
    this.ffprobe = options.ffprobe;
    this.timeoutMs = options.timeoutMs;
  }

  async download(options: DownloadOptions): Promise<DownloadResult> {
    const target = new DownloadTarget(options);
    await target.prepare();

    try {
      try {
        return await this.attempt(target, options, true);
      } catch (error: unknown) {
        if (!(error instanceof YTError) || !new YTStderr(error.stderr).isThumbnailEmbedFailure()) {
          throw error;
        }

        await target.removeLeftovers();

        return await this.attempt(target, options, false);
      }
    } catch (error: unknown) {
      await target.removeLeftovers();

      throw error;
    }
  }

  private args(target: DownloadTarget, withThumbnail: boolean): string[] {
    return [
      '--no-playlist',
      '-f',
      'bestaudio/best',
      '-x',
      '--audio-format',
      target.format,
      '--embed-metadata',
      ...(withThumbnail ? ['--embed-thumbnail', '--convert-thumbnails', 'jpg'] : []),
      '-o',
      target.outputTemplate,
      target.videoId.url,
    ];
  }

  private async attempt(
    target: DownloadTarget,
    { signal }: DownloadOptions,
    withThumbnail: boolean,
  ): Promise<DownloadResult> {
    const { stderr } = await this.executor.run(this.args(target, withThumbnail), {
      signal,
      timeoutMs: this.timeoutMs,
    });

    let stats;

    try {
      stats = await stat(target.path);
    } catch {
      throw new YTError(YTErrorKind.Unknown, `YTDL finished but "${target.path}" is missing`, {
        exitCode: 0,
        stderr,
      });
    }

    return {
      durationMs: (await this.ffprobe.durationMs(target.path, signal)) ?? 0,
      path: target.path,
      sizeBytes: stats.size,
    };
  }
}
