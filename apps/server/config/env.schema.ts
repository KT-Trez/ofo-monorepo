import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';
import { AUTH_MODES } from './constants.ts';

const PositiveIntSchema = z.coerce.number().int().min(1);

export const EnvPreprocess = (env: unknown) => {
  if (typeof env !== 'object' || env === null) {
    return {};
  }

  return Object.fromEntries(Object.entries(env).filter(([, value]) => value !== ''));
};

const EnvShape = {
  AUDIO_TMP_DIR: z.string().default(join(tmpdir(), 'music-ofo')),
  AUTH_MODE: z.enum(AUTH_MODES).default('none'),
  AUTH_OIDC_AUDIENCE: z.string().optional(),
  AUTH_OIDC_ISSUER: z.url().optional(),
  AUTH_TOKEN: z.string().optional(),
  FFMPEG_PATH: z.string().default('ffmpeg'),
  FFPROBE_PATH: z.string().default('ffprobe'),
  MEDIA_ENABLED: z.stringbool().default(true),
  MEDIA_MAX_CONCURRENT_DOWNLOADS: PositiveIntSchema.default(3),
  MEDIA_PREPARE_TIMEOUT_SECONDS: PositiveIntSchema.default(300),
  PORT: z.coerce.number().int().min(0).default(5000),
  SYNC_ENABLED: z.stringbool().default(false),
  SYNC_MAX_COVER_BYTES: PositiveIntSchema.default(5_242_880),
  SYNC_MAX_PUSH_BATCH: PositiveIntSchema.default(500),
  SYNC_TOMBSTONE_RETENTION_DAYS: PositiveIntSchema.default(90),
  YTDLP_INFO_TIMEOUT_SEC: PositiveIntSchema.default(30),
  YTDLP_JS_RUNTIME: z.string().default('node'),
  YTDLP_PATH: z.string().default('yt-dlp'),
  YTDLP_SEARCH_TIMEOUT_SEC: PositiveIntSchema.default(30),
};

export const EnvSchema = z.preprocess(EnvPreprocess, z.object(EnvShape)).superRefine((env, ctx) => {
  const addError = (message: string) => ctx.addIssue({ code: 'custom', message });

  if (env.SYNC_ENABLED && env.AUTH_MODE !== 'oidc') {
    addError('SYNC_ENABLED=true requires AUTH_MODE=oidc');
  }

  if (env.AUTH_MODE === 'token' && !env.AUTH_TOKEN) {
    addError('AUTH_MODE=token requires a non-empty AUTH_TOKEN');
  }

  if (env.AUTH_MODE === 'oidc' && (!env.AUTH_OIDC_ISSUER || !env.AUTH_OIDC_AUDIENCE)) {
    addError('AUTH_MODE=oidc requires AUTH_OIDC_ISSUER and AUTH_OIDC_AUDIENCE');
  }

  // phase 1: the OIDC verification and the sync module do not exist yet. Remove in phase 2.
  if (env.AUTH_MODE === 'oidc') {
    addError('AUTH_MODE=oidc is not implemented yet (phase 2), use "none" or "token"');
  }

  if (env.SYNC_ENABLED) {
    addError('SYNC_ENABLED=true is not implemented yet (phase 2)');
  }
});

export const isMediaEnabled = (env: Record<string, string | undefined>) => {
  return EnvShape.MEDIA_ENABLED.parse(env.MEDIA_ENABLED || undefined);
};

export const isSyncEnabled = (env: Record<string, string | undefined>) => {
  return EnvShape.SYNC_ENABLED.parse(env.MEDIA_ENABLED || undefined);
};
