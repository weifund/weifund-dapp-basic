const viewLoader = require('./components/viewLoader');
const campaignFocusView = require('./components/campaignFocusView');
const navBar = require('./components/navBar');
const footer = require('./components/footer');
const campaignsView = require('./components/campaignsView');
const campaignMedium = require('./components/campaignMedium');
const campaignHighlightMedium = require('./components/campaignHighlightMedium');

module.exports = {
  campaignHighlightMedium: campaignHighlightMedium,
  campaignMedium: campaignMedium,
  campaignsView: campaignsView,
  campaignFocusView: campaignFocusView,
  viewLoader: viewLoader,
  navBar: navBar,
  footer: footer,
};
