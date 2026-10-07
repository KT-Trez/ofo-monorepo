import { isAbortError } from '@ofo/ytdlp/errors/abort-error';
import { YTErrorKind, type YTErrorKinds } from '@ofo/ytdlp/errors/types';
import { YTError } from '@ofo/ytdlp/errors/YT-error';
import { YTTimeoutError } from '@ofo/ytdlp/errors/YT-timeout-error';
import { ApiException } from '../common/errors/api-exception.js';
import type { ErrorName } from '../common/errors/error-codes.js';

const WDL_ERROR_KIND_TO_API_ERROR: Readonly<Record<YTErrorKinds, ErrorName>> = {
  [YTErrorKind.AgeRestricted]: 'age_restricted',
  [YTErrorKind.Blocked]: 'upstream_blocked',
  [YTErrorKind.Conversion]: 'conversion_failed',
  [YTErrorKind.ExtractorOutdated]: 'extractor_outdated',
  [YTErrorKind.LiveStream]: 'live_stream_unsupported',
  [YTErrorKind.Network]: 'upstream_unreachable',
  [YTErrorKind.NoAudio]: 'no_audio_stream',
  [YTErrorKind.RegionBlocked]: 'region_blocked',
  [YTErrorKind.Unknown]: 'internal_error',
  [YTErrorKind.VideoPrivate]: 'video_private',
  [YTErrorKind.VideoUnavailable]: 'video_unavailable',
};

export const mapWdlError = (
  error: unknown,
  operation: 'download' | 'search',
): ApiException | Error => {
  if (error instanceof ApiException || isAbortError(error)) {
    return error;
  }

  if (error instanceof YTTimeoutError) {
    if (operation === 'download') {
      return new ApiException('prepare_timeout', undefined, { cause: error });
    }

    return new ApiException('upstream_unreachable', 'Fetching the metadata timed out', {
      cause: error,
    });
  }

  if (error instanceof YTError) {
    return new ApiException(WDL_ERROR_KIND_TO_API_ERROR[error.kind], undefined, { cause: error });
  }

  return new ApiException('internal_error', undefined, { cause: error });
};
