// require Polyglot
const Polyglot = require('node-polyglot');

// environment
const getLocale = require('./environment').getLocale;

// translations
const translations = require('./translations/');

// translate utility
const polyglot = new Polyglot({
  locale: getLocale(),
  phrases: translations[getLocale()],
});

// translate function
const t = function(phraseKey, phraseData) {
  return polyglot.t(phraseKey, phraseData);
};

// export i18n functions
module.exports = {
  t: t,
};
