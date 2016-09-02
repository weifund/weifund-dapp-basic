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

// ipfs instance
const ipfs = require('../ipfs').ipfs;

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

const handleCampaignContribution = require('./handleCampaignContribution');

// draw campaign
const loadAndDrawCampaign = function(campaignID, callback) {
  // draw loader
  document.querySelector('#view-focus').innerHTML = components.viewLoader();

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
    document.querySelector('#view-focus').innerHTML = components.campaignFocusView(campaignData);

    // draw qr code
    const qr = new QRious({
      element: document.querySelector('#campaign_qrcode'),
      size: 250,
      value: campaignData.addr,
    });

    // refresh all page buttons after redraw
    refreshPageButtons();
  });
};

module.exports = loadAndDrawCampaign;
