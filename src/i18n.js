// require Polyglot
import Polyglot from 'node-polyglot';

// environment
import { getLocale } from './environment';

// english translation
import enLocaleTranslation from './translations/en.json';
import zhLocaleTranslation from './translations/zh.json';

// all translations
const localeTranslations = {
  en: enLocaleTranslation,
  zh: zhLocaleTranslation,
};

// polyglot instance
const polyglot = new Polyglot({
  locale: getLocale(),
  phrases: localeTranslations[getLocale()],
});

// translate function
function t(phraseKey, phraseData) {
  return polyglot.t(phraseKey, phraseData);
};

// export i18n functions
module.exports = {
  t,
};
