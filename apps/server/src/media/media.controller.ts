import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ControllerMethods, SearchResults } from '@ofo/server-contract';
import { AudioDownloadService } from './audio/audio-download.service.js';
import { AUDIO_MIME_TYPES } from './audio/constants.ts';
import { CoverService } from './cover/cover.service.js';
import { DownloadAudioQuery } from './dto/download-audio-query.dto.ts';
import { MediaPathParams } from './dto/media-path-params.dto.ts';
import { SearchMediaQuery } from './dto/search-media-query.dto.ts';
import { MediaSearchService } from './search/media-search.service.js';
import { mapWdlError } from './wdl-error.mapper.ts';

@Controller({ path: 'media', version: '4' })
export class MediaController implements ControllerMethods<
  'downloadAudio' | 'downloadCover' | 'searchMedia',
  StreamableFile
> {
  private static readonly COVER_CACHE_CONTROL = 'public, max-age=86400';

  constructor(
    private readonly audio: AudioDownloadService,
    private readonly covers: CoverService,
    private readonly search: MediaSearchService,
  ) {}

  @Get(':source/:source_id/audio')
  public async downloadAudio(
    @Param() path: MediaPathParams,
    @Query() query: DownloadAudioQuery,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const mimeType = AUDIO_MIME_TYPES[query.format];
    const job = this.audio.join(path.source_id, query.format);
    res.once('close', () => job.release());

    const file = await job.result;

    if (res.destroyed) {
      throw new Error('The client closed the connection');
    }

    const stream = createReadStream(file.path);
    res.once('close', () => stream.destroy());

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Audio-Duration-Ms', String(file.durationMs));

    return new StreamableFile(stream, { length: file.sizeBytes, type: mimeType });
  }

  @Get(':source/:source_id/cover')
  public async downloadCover(
    @Param() path: MediaPathParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile | void> {
    const controller = new AbortController();
    res.once('close', () => controller.abort());

    const { data, contentType } = await this.covers
      .downloadCover(path.source_id, controller.signal)
      .catch((error: unknown) => {
        throw mapWdlError(error, 'search');
      });

    res.setHeader('Cache-Control', MediaController.COVER_CACHE_CONTROL);
    res.setHeader('ETag', `"${createHash('sha1').update(data).digest('base64url')}"`);

    if (req.fresh) {
      res.status(HttpStatus.NOT_MODIFIED);
      return;
    }

    return new StreamableFile(data, { length: data.length, type: contentType });
  }

  @Get('search')
  public searchMedia(@Query() query: SearchMediaQuery): Promise<SearchResults> {
    return this.search.search({ limit: query.limit, query: query.q, rawCursor: query.cursor });
  }
}
