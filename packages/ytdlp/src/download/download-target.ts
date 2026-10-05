import { mkdir, readdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { AudioFormat, type AudioFormats, type DownloadOptions } from './types.ts';
import { VideoId } from './video-id.ts';

export class DownloadTarget {
  public readonly format: AudioFormats;
  /** Absolute path to a directory. */
  public readonly outDir: string;
  public readonly videoId: VideoId;

  /** @throws TypeError for an invalid video id or an unsupported format. */
  constructor({
    format,
    outDir,
    sourceId,
  }: Pick<DownloadOptions, 'format' | 'outDir' | 'sourceId'>) {
    if (!Object.values(AudioFormat).includes(format)) {
      throw new TypeError(`Unsupported audio format: "${format}"`);
    }

    this.format = format;
    this.outDir = resolve(outDir);
    this.videoId = new VideoId(sourceId);
  }

  /** The `-o` template of yt-dlp; `%` must be escaped in output templates. */
  get outputTemplate(): string {
    return `${join(this.outDir, this.videoId.value).replaceAll('%', '%%')}.%(ext)s`;
  }

  get path(): string {
    return join(this.outDir, `${this.videoId.value}.${this.format}`);
  }

  async prepare(): Promise<void> {
    await mkdir(this.outDir, { recursive: true });
  }

  async removeLeftovers(): Promise<void> {
    const sourceId = this.videoId.value;
    const otherFormat = this.format === AudioFormat.Opus ? AudioFormat.M4a : AudioFormat.Opus;
    const keep = `${sourceId}.${otherFormat}`;

    let names: string[];

    try {
      names = await readdir(this.outDir);
    } catch {
      return;
    }

    await Promise.all(
      names
        .filter(name => name.startsWith(`${sourceId}.`) && name !== keep)
        .map(name => rm(join(this.outDir, name), { force: true })),
    );
  }
}
