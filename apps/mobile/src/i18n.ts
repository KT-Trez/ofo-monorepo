import { initI18n, LanguagePreference, pickLanguage } from '@ofo/i18n';
import { getLocales } from 'expo-localization';

const DEVICE_LANGUAGES = getLocales()
  .map(locale => locale.languageCode)
  .filter(languageCode => languageCode !== null);

// todo: read the saved preference (expo-sqlite kv-store) once settings are persisted
initI18n(pickLanguage(LanguagePreference.System, DEVICE_LANGUAGES));
