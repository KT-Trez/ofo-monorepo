import type { OperationPath, Source } from '@ofo/server-contract';
import { IsIn, Matches } from 'class-validator';
import { MEDIA_SOURCES } from '../../../config/constants.ts';
import { SOURCE_VALIDATION_OPTIONS } from './common.ts';

type CoverPath = OperationPath<'downloadCover'>;
type DownloadPath = OperationPath<'downloadAudio'>;

export class MediaPathParams implements DownloadPath, CoverPath {
  private static readonly YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;

  @IsIn(MEDIA_SOURCES, SOURCE_VALIDATION_OPTIONS)
  source!: Source;

  @Matches(MediaPathParams.YOUTUBE_ID_PATTERN, {
    message: 'source_id is not a valid YouTube video id',
  })
  source_id!: string;
}
