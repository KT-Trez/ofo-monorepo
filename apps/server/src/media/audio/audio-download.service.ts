import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AudioFormat } from '@ofo/server-contract';
import { YT } from '@ofo/ytdlp/YT';
import { Semaphore } from 'es-toolkit/promise';
import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import type { ServerConfig } from '../../../config/configuration.js';
import { type FlightSubscription, SingleFlight } from '../../common/concurrency/single-flight.js';
import { ApiException } from '../../common/errors/api-exception.js';
import { mapWdlError } from '../wdl-error.mapper.ts';

type AudioJob = FlightSubscription<PreparedAudio>;

type PreparedAudio = {
  /** Working directory of the job; removed together with the file. */
  dir: string;
  durationMs: number;
  format: AudioFormat;
  path: string;
  sizeBytes: number;
};

@Injectable()
export class AudioDownloadService implements OnModuleInit {
  public static readonly BUSY_RETRY_AFTER_SEC = 10;
  public static readonly WORK_DIR_PREFIX = 'ofo-';

  private readonly flights = new SingleFlight<string, PreparedAudio>(file =>
    this.removeDir(file.dir),
  );

  private readonly logger = new Logger(AudioDownloadService.name);
  private readonly slots: Semaphore;
  private readonly tmpDir: string;

  constructor(
    private readonly avd: YT,
    private readonly config: ConfigService<ServerConfig>,
  ) {
    const audio = this.config.getOrThrow('audio', { infer: true });
    const features = this.config.getOrThrow('features', { infer: true });

    this.slots = new Semaphore(features.media.max_concurrent_downloads);
    this.tmpDir = audio.tmpDir;
  }

  async onModuleInit(): Promise<void> {
    const entries = await readdir(this.tmpDir).catch(() => [] as string[]);

    await Promise.all(
      entries
        .filter(name => name.startsWith(AudioDownloadService.WORK_DIR_PREFIX))
        .map(name => this.removeDir(join(this.tmpDir, name))),
    );
  }

  /**
   * Starts the preparation of the file or joins the one in progress. The caller must `release()`
   * the returned job when it is done with the file (or gave up waiting for it).
   */
  join(sourceId: string, format: AudioFormat): AudioJob {
    return this.flights.join(`${sourceId}:${format}`, signal => {
      return this.prepare(format, signal, sourceId);
    });
  }

  private async prepare(
    format: AudioFormat,
    signal: AbortSignal,
    sourceId: string,
  ): Promise<PreparedAudio> {
    if (this.slots.available < 1) {
      throw new ApiException('server_busy', 'Too many downloads are running, try again later', {
        retryAfterSec: AudioDownloadService.BUSY_RETRY_AFTER_SEC,
      });
    }

    await this.slots.acquire();
    let dir: string | undefined;

    try {
      await mkdir(this.tmpDir, { recursive: true });
      dir = await mkdtemp(join(this.tmpDir, AudioDownloadService.WORK_DIR_PREFIX));
      signal.throwIfAborted();

      const result = await this.avd.download({ format, outDir: dir, signal, sourceId });

      return {
        dir,
        durationMs: result.durationMs,
        format,
        path: result.path,
        sizeBytes: result.sizeBytes,
      };
    } catch (error: unknown) {
      if (dir) {
        await this.removeDir(dir);
      }

      throw mapWdlError(error, 'download');
    } finally {
      this.slots.release();
    }
  }

  private async removeDir(dir: string): Promise<void> {
    await rm(dir, { force: true, recursive: true }).catch((error: unknown) => {
      this.logger.warn(`Cannot remove "${dir}": ${String(error)}`);
    });
  }
}
