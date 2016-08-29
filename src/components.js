const getLocale = require('./environment').getLocale;

const parseDisambiguatedDescription = function(campaignDataObject) {
  return campaignDataObject.hasValidData && campaignDataObject.data.i18n[getLocale()].disambiguatedDescription || `A crowdfund that is valid enough to be listed, but does not have a description.`;
}

const viewLoader = require('./components/viewLoader');
const campaignFocusView = require('./components/campaignFocusView');
const navBar = require('./components/navBar');
const footer = require('./components/footer');
const campaignsView = require('./components/campaignsView');
const campaignMedium = require('./components/campaignMedium');
const campaignHighlightMedium = require('./components/campaignHighlightMedium');
const campaignContributeView = require('./components/campaignContributeView');

module.exports = {
  campaignHighlightMedium: campaignHighlightMedium,
  campaignMedium: campaignMedium,
  campaignsView: campaignsView,
  campaignContributeView: campaignContributeView,
  campaignFocusView: campaignFocusView,
  viewLoader: viewLoader,
  navBar: navBar,
  footer: footer,
};
