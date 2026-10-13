import type { AudioFormat, Source } from '@ofo/server-contract';

export const AUDIO_FORMATS: readonly AudioFormat[] = ['opus', 'm4a'];
export const AUTH_MODES = ['none', 'oidc', 'token'] as const;
export const DEFAULT_AUDIO_FORMAT: AudioFormat = 'opus';
export const MEDIA_SOURCES: readonly Source[] = ['youtube'];
