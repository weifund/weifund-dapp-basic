// requires
const QRious = require('qrious');

// utils
const utils = require('weifund-util');
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

// web3
const web3 = require('../web3').web3;

// web3
const ipfs = require('../ipfs').ipfs;

// loadCampaign method
const lib = require('weifund-lib');
const getCampaigns = lib.getCampaigns;

// router instance
var router = require('../router');
const getRouter = router.getRouter;
const refreshPageButtons = router.refreshPageButtons;

// require i18n
const t = require('../i18n').t;

// build all input sliders
const buildAllInputSliders = require('./drawAllInputSliders');

const handleCampaignRefund = require('./handleCampaignRefund');

// draw campaign
const loadAndDrawCampaignRefund = function(campaignID, callback) {
  // draw loader
  document.querySelector('#view-campaign-refund').innerHTML = components.viewLoader({t: t});

  // load campaign fresh to draw
  getCampaigns({
    // set network
    // or 'testnet'
    network: getNetwork(),

    // set campaign selector
    // array (i.e. array of campaignIDs)
    selector: [campaignID],

    // set web3 provider
    web3Provider: web3.currentProvider,

    // set ipfs provider
    ipfsProvider: ipfs.currentProvider,
  }, function(campaignLoadError, campaignDataObject){
    if (campaignLoadError) {
      log('Campaign load while drawing...', campaignLoadError);
      callback(campaignLoadError, null);
      return;
    }

    // campaign data
    const campaignData = campaignDataObject[campaignID];

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
