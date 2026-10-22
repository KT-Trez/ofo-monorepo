import type { SetOptional } from 'type-fest';
import { TRANSLATION_NAMESPACE } from './constants.ts';
import type { pl } from './locales/pl.ts';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof TRANSLATION_NAMESPACE;
    resources: { [TRANSLATION_NAMESPACE]: typeof pl };
  }
}

type LocalPluralSuffix = `_${'few' | 'many'}`;

/**
 * The shape of a translation. Keys ending in `_few` or `_many` are optional (language specific).
 */
export type TranslationOf<T> = SetOptional<
  { [K in keyof T]: T[K] extends string ? string : TranslationOf<T[K]> },
  Extract<keyof T, `${string}${LocalPluralSuffix}`>
>;
