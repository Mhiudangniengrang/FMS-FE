import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

import enTranslation from './en.json';
import viTranslation from './vi.json';

// Get language from cookie or use browser language or default to 'en'
const getDefaultLanguage = () => {
  const savedLang = Cookies.get('i18nextLng');
  if (savedLang) return savedLang;
  
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'vi'].includes(browserLang) ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: enTranslation,
      vi: viTranslation
    },
    lng: getDefaultLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;