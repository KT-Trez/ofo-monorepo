import {
  changeLanguage,
  initI18n,
  isLanguage,
  LanguagePreference,
  type LanguagePreferences,
  pickLanguage,
} from '@ofo/i18n';
import { getLocales } from 'expo-localization';
import { Storage } from 'expo-sqlite/kv-store';

const DEVICE_LANGUAGES = getLocales()
  .map(locale => locale.languageCode)
  .filter(languageCode => languageCode !== null);
const LANGUAGE_PREFERENCE_KEY = 'languagePreference';

export const applyLanguagePreference = (preference: LanguagePreferences) => {
  Storage.setItemSync(LANGUAGE_PREFERENCE_KEY, preference);
  changeLanguage(pickLanguage(preference, DEVICE_LANGUAGES));
};

const readLanguagePreference = (): LanguagePreferences => {
  const saved = Storage.getItemSync(LANGUAGE_PREFERENCE_KEY);

  return isLanguage(saved) ? saved : LanguagePreference.System;
};

initI18n(pickLanguage(readLanguagePreference(), DEVICE_LANGUAGES));
