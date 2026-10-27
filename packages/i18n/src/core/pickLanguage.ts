import {
  Language,
  LanguagePreference,
  type LanguagePreferences,
  type Languages,
} from '../constants.ts';

const AVAILABLE_LANGUAGES: readonly string[] = Object.values(Language);

export const isLanguage = (code: string | null): code is Languages => {
  return !!code && AVAILABLE_LANGUAGES.includes(code);
};

/**
 * Picks the language for a preference.
 * For `system` it is the first device language the app is translated to, English otherwise.
 *
 * @param preference The preferred language.
 * @param languages ISO 639-1 codes in the order of the device settings, e.g. `['pl', 'en']`.
 */
export const pickLanguage = (
  preference: LanguagePreferences,
  languages: readonly string[],
): Languages => {
  if (preference !== LanguagePreference.System) {
    return preference;
  }

  return languages.map(code => code.toLowerCase()).find(isLanguage) ?? Language.En;
};
