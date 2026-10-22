import { changeLanguage as changeI18nLanguage } from 'i18next';
import type { Languages } from '../constants.ts';

export const changeLanguage = (language: Languages) => {
  void changeI18nLanguage(language);
};
