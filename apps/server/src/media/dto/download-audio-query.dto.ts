import type { AudioFormat, OperationQuery } from '@ofo/server-contract';
import { IsIn, IsOptional } from 'class-validator';
import { AUDIO_FORMATS, DEFAULT_AUDIO_FORMAT } from '../../../config/constants.ts';
import { errorHint } from '../../common/validation/error-hint.ts';

type DownloadQuery = OperationQuery<'downloadAudio'>;

export class DownloadAudioQuery implements DownloadQuery {
  @IsOptional()
  @IsIn(AUDIO_FORMATS, {
    ...errorHint('unsupported_format'),
    message: `The audio format must be one of: ${AUDIO_FORMATS.join(', ')}`,
  })
  format: AudioFormat = DEFAULT_AUDIO_FORMAT;
}
