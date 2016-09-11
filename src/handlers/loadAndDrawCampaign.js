// requires
const QRious = require('qrious');

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
const refreshPageButtons = router.refreshPageButtons;

// require i18n
const t = require('../i18n').t;

const handleCampaignContribution = require('./handleCampaignContribution');

// draw campaign
const loadAndDrawCampaign = function(campaignID, callback) {
  // draw loader
  document.querySelector('#view-focus').innerHTML = components.viewLoader({t: t});

  // load campaign fresh to draw
  getCampaigns({
    network: getNetwork(),
    selector: [campaignID],
    web3Provider: web3.currentProvider,
    ipfsProvider: ipfs.currentProvider,
  }, function(campaignLoadError, campaignDataObject){
    if (campaignLoadError) {
      log('Campaign load while drawing...', campaignLoadError);
      callback(campaignLoadError, null);
      return;
    }

    console.log(campaignDataObject);

    // campaign data
    const campaignData = campaignDataObject[campaignID];

    // save in campaigns
    setCampaign(campaignID, campaignData);

    // draw campaign focus
    document.querySelector('#view-focus').innerHTML = components.campaignFocusView({campaignObject: campaignData, web3: web3, getLocale: getLocale, t: t});

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
