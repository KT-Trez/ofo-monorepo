import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { UnknownRecord } from 'type-fest';
import { Language, type Languages, TRANSLATION_NAMESPACE } from '../constants.ts';
import { en } from '../locales/en.ts';
import { pl } from '../locales/pl.ts';

const I18N_RESOURCES: Readonly<Record<Languages, { [TRANSLATION_NAMESPACE]: UnknownRecord }>> = {
  en: { [TRANSLATION_NAMESPACE]: en },
  pl: { [TRANSLATION_NAMESPACE]: pl },
};

export const initI18n = (language: Languages) => {
  void use(initReactI18next).init({
    defaultNS: TRANSLATION_NAMESPACE,
    fallbackLng: Language.En,
    // the resources are bundled, so there is nothing to wait for
    initAsync: false,
    lng: language,
    ns: [TRANSLATION_NAMESPACE],
    resources: I18N_RESOURCES,
  });
};
