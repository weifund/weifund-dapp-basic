// requires
const QRious = require('qrious');

// utils
const utils = require('../utils/');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;
const parseSolidityMethodName = utils.parseSolidityMethodName;
const oneDay = utils.oneDay;

// require components
const components = require('../components');

// environment
const environment = require('../environment');
const getNetwork = environment.getNetwork;
const getLocale = environment.getLocale;
const getContractEnvironment = environment.getContractEnvironment;
const txObject = environment.txObject;
const getDefaultAccount = environment.getDefaultAccount;
const setDefaultAccount = environment.setDefaultAccount;

// campaign environment methods
const getCampaign = environment.getCampaign;
const setCampaign = environment.setCampaign;
const getCampaigns = environment.getCampaigns;

// web3
const web3 = require('../web3').web3;

// loadCampaign method
const lib = require('../lib');
const getCampaignData = lib.getCampaign;
const getCampaignsData = lib.getCampaigns;

// router instance
var router = require('../router');
const getRouter = router.getRouter;
const refreshPageButtons = router.refreshPageButtons;

// require i18n
const t = require('../i18n').t;

// build all input sliders
const buildAllInputSliders = require('../utils').buildAllInputSliders;

const handleCampaignRefund = require('./handleCampaignRefund');

// draw campaign
const loadAndDrawCampaignRefund = function(campaignID, callback) {
  // draw loader
  document.querySelector('#view-campaign-refund').innerHTML = components.viewLoader({t: t});

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
    document.querySelector('#view-campaign-refund').innerHTML = `
    ${components.campaignRefundForm({campaignObject: campaignData, defaultAccount: getDefaultAccount, web3: web3})}

    ${components.campaignRefundReview({campaignObject: campaignData, defaultAccount: getDefaultAccount, web3: web3})}

    <div id="view-campaign-refund-receipt"></div>
    `;

    // build all sliders
    buildAllInputSliders();

    // refresh all page buttons after redraw
    refreshPageButtons();

    // fire callback
    callback(null, 1);
  });
};

module.exports = loadAndDrawCampaignRefund;
