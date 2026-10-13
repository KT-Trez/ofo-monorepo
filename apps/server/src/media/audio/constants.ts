import type { AudioFormat } from '@ofo/server-contract';

export const AUDIO_MIME_TYPES: Readonly<Record<AudioFormat, string>> = {
  m4a: 'audio/mp4',
  opus: 'audio/ogg',
};
