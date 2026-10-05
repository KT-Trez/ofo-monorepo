import { join } from 'node:path';
import { AudioDownloader } from './download/audio-downloader.ts';
import type { DownloadOptions, DownloadResult } from './download/types.ts';
import { VideoId } from './download/video-id.ts';
import { YTErrorKind } from './errors/types.ts';
import { YTError } from './errors/YT-error.ts';
import { YTMissingBinaryError } from './errors/YT-missing-binary-error.ts';
import { MetadataMapper } from './mapper/mapper.ts';
import type { SearchItem, SearchOptions, VideoInfo, VideoInfoOptions } from './mapper/types.ts';
import { FFprobe } from './probe/ffprobe.ts';
import { NodeProcessRunner } from './run/node-process-runner.ts';
import type { ProcessRunner } from './run/types.ts';
import { YTBinExecutor } from './run/YT-bin-executor.ts';

export type YTOptions = {
  binaryPath: string;
  /** Extra arguments added to every invocation (e.g. `--proxy`, `--remote-components ejs:github`). */
  extraArgs?: string[];
  /**
   * Path of the `ffmpeg` binary or of its directory (`--ffmpeg-location`).
   *
   * @default 'ffmpeg'
   */
  ffmpegPath?: string;
  /**
   * Path of the `ffprobe` binary, measures the duration of the downloaded files.
   *
   * @default 'ffprobe'
   */
  ffprobePath?: string;
  /**
   * JS runtime for the YouTube challenges, ex.: `node` or `node:/usr/bin/node`.
   */
  jsRuntime?: string;
  /**
   * Grace period between SIGTERM and SIGKILL when aborting.
   *
   * @default 5000
   * */
  killGraceMs?: number;
  /** Replaces the process runner (used by the tests). */
  runner?: ProcessRunner;
  timeoutsMs: YTTimeouts;
};

export type YTTimeouts = {
  download: number;
  info: number;
  probe?: number;
  search: number;
  update: number;
  version?: number;
};

export class YT {
  private readonly downloader: AudioDownloader;
  private readonly executor: YTBinExecutor;
  private readonly mapper = new MetadataMapper();
  private readonly timeouts: YTTimeouts;

  /**
   * @throws YTMissingBinaryError when `yt-dlp`, `ffmpeg` or `ffprobe` is missing or not executable
   */
  constructor(options: YTOptions) {
    const killGraceMs = options.killGraceMs ?? YTBinExecutor.DEFAULT_KILL_GRACE_MS;
    const runner = options.runner ?? new NodeProcessRunner();
    const ffprobePath = options.ffprobePath ?? 'ffprobe';

    YT.assertBinaries(runner, options.binaryPath, options.ffmpegPath ?? 'ffmpeg', ffprobePath);

    const ffprobe = new FFprobe({
      binaryPath: ffprobePath,
      killGraceMs,
      runner,
      timeoutMs: options.timeoutsMs.probe ?? options.timeoutsMs.info,
    });

    this.executor = new YTBinExecutor({ ...options, killGraceMs, runner });
    this.timeouts = options.timeoutsMs;

    this.downloader = new AudioDownloader({
      executor: this.executor,
      ffprobe,
      timeoutMs: options.timeoutsMs.download,
    });
  }

  private static assertBinaries(
    runner: ProcessRunner,
    ytdlpPath: string,
    ffmpegPath: string,
    ffprobePath: string,
  ): void {
    if (!runner.isExecutable(ytdlpPath)) {
      throw new YTMissingBinaryError('yt-dlp', ytdlpPath);
    }

    // `--ffmpeg-location` accepts the directory of the binaries as well
    if (!runner.isExecutable(ffmpegPath) && !runner.isExecutable(join(ffmpegPath, 'ffmpeg'))) {
      throw new YTMissingBinaryError('ffmpeg', ffmpegPath);
    }

    if (!runner.isExecutable(ffprobePath)) {
      throw new YTMissingBinaryError('ffprobe', ffprobePath);
    }
  }

  /**
   * Downloads the best audio of a video and converts it to `format` at
   * `<outDir>/<sourceId>.<format>`
   *
   * @throws YTError on yt-dlp failures
   * @throws AbortError on `signal` abort
   * @throws TimeoutError on timeout
   */
  download(options: DownloadOptions): Promise<DownloadResult> {
    return this.downloader.download(options);
  }

  async info(sourceId: string, { signal }: VideoInfoOptions = {}): Promise<VideoInfo> {
    const videoId = new VideoId(sourceId);
    const { json, stderr } = await this.executor.runJson(
      ['--dump-single-json', '--no-playlist', videoId.url],
      {
        signal,
        timeoutMs: this.timeouts.info,
      },
    );

    const mapped = this.mapper.toVideoInfo(json);

    if (!mapped) {
      throw new YTError(YTErrorKind.Unknown, 'YTDL returned no usable video info', {
        exitCode: 0,
        stderr,
      });
    }

    return mapped;
  }

  async search({ limit, offset, query, signal }: SearchOptions): Promise<SearchItem[]> {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new RangeError('limit must be a positive integer');
    }

    if (!Number.isInteger(offset) || offset < 0) {
      throw new RangeError('offset must be a non-negative integer');
    }

    const { json } = await this.executor.runJson(
      ['--flat-playlist', '--dump-single-json', `ytsearch${offset + limit}:${query}`],
      { signal, timeoutMs: this.timeouts.search },
    );

    return this.mapper.toSearchResults(json).slice(offset, offset + limit);
  }

  async update(): Promise<string> {
    await this.executor.run(['-U'], { timeoutMs: this.timeouts.update });

    return this.version();
  }

  async version(): Promise<string> {
    const { stdout } = await this.executor.run(['--version'], {
      timeoutMs: this.timeouts.version ?? this.timeouts.info,
    });

    return stdout.trim();
  }
}
