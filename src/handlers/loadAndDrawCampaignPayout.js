// utils
const utils = require('../utils/');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;

// require components
const components = require('../components');

// environment
const environment = require('../environment');
const getNetwork = environment.getNetwork;
const getLocale = environment.getLocale;
const txObject = environment.txObject;
const getDefaultAccount = environment.getDefaultAccount;
const setDefaultAccount = environment.setDefaultAccount;

// campaign environment methods
const getCampaign = environment.getCampaign;
const setCampaign = environment.setCampaign;

// web3
const web3 = require('../web3').web3;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('../contracts');
const campaign = contracts.campaignContractFactory;

// loadCampaign method
const lib = require('../lib');
const getCampaignData = lib.getCampaign;
const getCampaignsData = lib.getCampaigns;

// router
const refreshPageButtons = require('../router').refreshPageButtons;

// require i18n
const t = require('../i18n').t;

// draw utils
const buildAllInputSliders = require('../utils').buildAllInputSliders;

const loadAndDrawCampaignPayout = function(campaignID, callback) {
  // handle empty callback
  if (typeof callback !== 'function') {
    callback = function(e, r) {};
  }

  // draw loader
  document.querySelector('#view-campaign-payout').innerHTML = components.viewLoader();

  // load campaign fresh to draw
  getCampaignData(campaignID, function(campaignLoadError, campaignData){
    if (campaignLoadError) {
      log('Campaign load while drawing...', campaignLoadError);
      callback(campaignLoadError, null);
      return;
    }

    // save in campaigns
    setCampaign(campaignID, campaignData);

    // draw campaign focus
    document.querySelector('#view-campaign-payout').innerHTML = components.campaignPayoutView({campaignObject: campaignData, getLocale: getLocale});

    // refresh all page buttons after redraw
    refreshPageButtons();

    // build all sliders
    buildAllInputSliders();

    // callback
    callback(null, true);
  });
};

module.exports = loadAndDrawCampaignPayout;
