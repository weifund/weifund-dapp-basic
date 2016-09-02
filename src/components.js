const campaignFocusView = require('./components/campaignFocusView');
const campaignsView = require('./components/campaignsView');
const campaignMedium = require('./components/campaignMedium');
const campaignHighlightMedium = require('./components/campaignHighlightMedium');
const campaignContributeView = require('./components/campaignContributeView');
const campaignPayoutView = require('./components/campaignPayoutView');
const campaignContributeReceipt = require('./components/campaignContributeReceipt');

const viewLoader = require('./components/viewLoader');
const navBar = require('./components/navBar');
const footer = require('./components/footer');
const startCampaignView = require('./components/startCampaignView');

module.exports = {
  campaignHighlightMedium: campaignHighlightMedium,
  campaignMedium: campaignMedium,
  campaignsView: campaignsView,
  campaignPayoutView: campaignPayoutView,
  campaignContributeView: campaignContributeView,
  campaignFocusView: campaignFocusView,
  campaignContributeReceipt: campaignContributeReceipt,
  viewLoader: viewLoader,
  startCampaignView: startCampaignView,
  navBar: navBar,
  footer: footer,
};
