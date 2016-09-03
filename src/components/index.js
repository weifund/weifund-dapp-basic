const campaignFocusView = require('./campaignFocusView');
const campaignsView = require('./campaignsView');
const campaignMedium = require('./campaignMedium');
const campaignHighlightMedium = require('./campaignHighlightMedium');
const campaignContributeView = require('./campaignContributeView');
const campaignPayoutView = require('./campaignPayoutView');
const campaignContributeReceipt = require('./campaignContributeReceipt');

const campaignRefundForm = require('./campaignRefundForm');
const campaignRefundReview = require('./campaignRefundReview');

const viewLoader = require('./viewLoader');
const navBar = require('./navBar');
const footer = require('./footer');
const startCampaignView = require('./startCampaignView');

module.exports = {
  campaignRefundReview: campaignRefundReview,
  campaignRefundForm: campaignRefundForm,

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
