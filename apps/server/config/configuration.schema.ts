import { z } from 'zod';
import { DEFAULT_AUDIO_FORMAT, MEDIA_SOURCES } from './constants.ts';
import { EnvSchema } from './env.schema.ts';

export const ConfigurationSchema = EnvSchema.transform(env => ({
  app: {
    port: env.PORT,
  },
  audio: {
    ffmpegPath: env.FFMPEG_PATH,
    ffprobePath: env.FFPROBE_PATH,
    /** Parent of the per-request working directories of the audio downloads. */
    tmpDir: env.AUDIO_TMP_DIR,
  },
  auth: {
    mode: env.AUTH_MODE,
    oidc: {
      audience: env.AUTH_OIDC_AUDIENCE,
      issuer: env.AUTH_OIDC_ISSUER,
    },
    token: env.AUTH_TOKEN,
  },
  features: {
    media: {
      default_audio_format: DEFAULT_AUDIO_FORMAT,
      enabled: env.MEDIA_ENABLED,
      max_concurrent_downloads: env.MEDIA_MAX_CONCURRENT_DOWNLOADS,
      prepare_timeout_seconds: env.MEDIA_PREPARE_TIMEOUT_SECONDS,
      sources: [...MEDIA_SOURCES],
    },
    sync: {
      enabled: env.SYNC_ENABLED,
      max_cover_bytes: env.SYNC_MAX_COVER_BYTES,
      max_push_batch: env.SYNC_MAX_PUSH_BATCH,
      tombstone_retention_days: env.SYNC_TOMBSTONE_RETENTION_DAYS,
    },
  },
  ytdlp: {
    /** Timeouts of the short operations; the download one is `features.media.prepare_timeout_seconds`. */
    infoTimeoutSec: env.YTDLP_INFO_TIMEOUT_SEC,
    /** `--js-runtimes` value (yt-dlp >= 2025.11.12), e.g. `node`. */
    jsRuntime: env.YTDLP_JS_RUNTIME,
    path: env.YTDLP_PATH,
    searchTimeoutSec: env.YTDLP_SEARCH_TIMEOUT_SEC,
  },
}));

export type ServerConfig = z.output<typeof ConfigurationSchema>;
