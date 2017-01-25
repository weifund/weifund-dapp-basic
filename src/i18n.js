// require Polyglot
import Polyglot from 'node-polyglot';

// environment
import { getLocale } from './environment';

// english translation
import enLocaleTranslation from './translations/en.json';

// all translations
const localeTranslations = {
  en: enLocaleTranslation,
};

// polyglot instance
const polyglot = new Polyglot({
  locale: getLocale(),
  phrases: localeTranslations[getLocale()],
});

// translate function
export function t(phraseKey, phraseData) {
  return polyglot.t(phraseKey, phraseData);
}
