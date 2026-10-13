import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { YT } from '@ofo/ytdlp/YT';
import { ApiException } from '../../common/errors/api-exception.js';
import { type Box, toAspect } from './aspect-crop.util.js';
import {
  COVER_MAX_HEIGHT,
  COVER_MAX_WIDTH,
  COVER_WEBP_QUALITY,
  THUMBNAIL_FETCH_TIMEOUT_MS,
  THUMBNAIL_MAX_BYTES,
  TRIM_MIN_AREA_RATIO,
  TRIM_MIN_SIDE_PX,
  TRIM_THRESHOLD,
} from './constants.js';
import { readCapped } from './read-capped.util.js';
import { rankThumbnails } from './thumbnail-ranking.util.js';

export type OriginalCover = { contentType: 'image/webp'; data: Buffer };

class SkippableThumbnailError extends Error {
  constructor(
    message: string,
    public readonly apiError: ApiException,
  ) {
    super(message, { cause: apiError });
  }
}

const isAbort = (signal: AbortSignal | undefined): boolean => signal?.aborted === true;

@Injectable()
export class CoverService {
  private readonly logger = new Logger(CoverService.name);

  constructor(private readonly ytdlp: YT) {}

  /**
   * The best thumbnail of the video as a 16:9 WebP of at most 1280x720 (never enlarged), without
   * black bars.
   *
   * @throws YtDlpError (from `ytdlp.info`) and abort errors unchanged.
   * @throws ApiException 2010 when the video has no usable thumbnail, 2020 when none could be
   *   downloaded, 1006 when none could be processed.
   */
  async downloadCover(sourceId: string, signal?: AbortSignal): Promise<OriginalCover> {
    const info = await this.ytdlp.info(sourceId, { signal });
    const urls = rankThumbnails(info.thumbnails);

    if (urls.length === 0) {
      throw new ApiException('video_unavailable', 'The video has no thumbnail');
    }

    let lastError: ApiException | undefined;

    for (const url of urls) {
      try {
        // oxlint-disable-next-line no-await-in-loop -- thumbnails are tried one after another
        const cover = await this.download(url, signal);
        // oxlint-disable-next-line no-await-in-loop -- thumbnails are tried one after another
        const data = await this.normalize(cover);

        return { contentType: 'image/webp', data };
      } catch (error) {
        if (isAbort(signal)) {
          throw signal?.reason ?? error;
        }

        if (error instanceof SkippableThumbnailError) {
          this.logger.warn(`Thumbnail ${url} skipped: ${error.message}`);
          lastError = error.apiError;
          continue;
        }

        throw error;
      }
    }

    throw lastError ?? new ApiException('upstream_unreachable', 'No thumbnail could be downloaded');
  }

  /** Area to keep: the original without black bars, cut (centered) to exactly 16:9. */
  private async cropBox(input: Buffer): Promise<Box> {
    const { height, width } = await this.readSize(input);
    const content = (await this.findContent(input, width, height)) ?? {
      height,
      left: 0,
      top: 0,
      width,
    };

    return toAspect(content);
  }

  private async download(url: string, signal?: AbortSignal): Promise<Buffer> {
    const timeout = AbortSignal.timeout(THUMBNAIL_FETCH_TIMEOUT_MS);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

    try {
      const response = await fetch(url, { signal: combined });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type');

      if (contentType && !contentType.toLowerCase().startsWith('image/')) {
        throw new Error(`Unexpected content type ${contentType}`);
      }

      const declared = Number(response.headers.get('content-length'));

      if (declared > THUMBNAIL_MAX_BYTES) {
        throw new Error(`Thumbnail too large (${declared} bytes)`);
      }

      return await readCapped(response, THUMBNAIL_MAX_BYTES);
    } catch (error) {
      if (isAbort(signal)) {
        throw signal?.reason ?? error;
      }

      const message = error instanceof Error ? error.message : String(error);

      throw new SkippableThumbnailError(
        message,
        new ApiException('upstream_unreachable', `Thumbnail download failed: ${message}`, {
          cause: error,
        }),
      );
    }
  }

  private async findContent(input: Buffer, width: number, height: number): Promise<Box | null> {
    let info;
    try {
      ({ info } = await sharp(input)
        .trim({ background: '#000000', threshold: TRIM_THRESHOLD })
        .raw()
        .toBuffer({ resolveWithObject: true }));
    } catch {
      return null; // e.g. fully black image: nothing to trim to
    }

    const box: Box = {
      height: info.height,
      left: -(info.trimOffsetLeft ?? 0),
      top: -(info.trimOffsetTop ?? 0),
      width: info.width,
    };
    const tooSmall = box.width < TRIM_MIN_SIDE_PX || box.height < TRIM_MIN_SIDE_PX;
    const tooMuchRemoved = box.width * box.height < width * height * TRIM_MIN_AREA_RATIO;
    const outside = box.left + box.width > width || box.top + box.height > height;

    return tooSmall || tooMuchRemoved || outside ? null : box;
  }

  private async normalize(input: Buffer): Promise<Buffer> {
    try {
      const box = await this.cropBox(input);

      return await sharp(input)
        .extract(box)
        .resize({
          fit: 'inside',
          height: COVER_MAX_HEIGHT,
          width: COVER_MAX_WIDTH,
          withoutEnlargement: true,
        })
        .webp({ quality: COVER_WEBP_QUALITY })
        .toBuffer();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      throw new SkippableThumbnailError(
        message,
        new ApiException('internal_error', 'Thumbnail processing failed', { cause: error }),
      );
    }
  }

  private async readSize(input: Buffer): Promise<{ height: number; width: number }> {
    const { height, width } = await sharp(input).metadata();
    if (!width || !height) {
      throw new Error('Image has no dimensions');
    }

    return { height, width };
  }
}
