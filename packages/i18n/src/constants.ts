import type { ValueOf } from 'type-fest';

export const Language = {
  En: 'en',
  Pl: 'pl',
} as const;
export type Languages = ValueOf<typeof Language>;

export const LanguagePreference = {
  ...Language,
  System: 'system',
} as const;
export type LanguagePreferences = ValueOf<typeof LanguagePreference>;

export const TRANSLATION_NAMESPACE = 'ofo:common';
