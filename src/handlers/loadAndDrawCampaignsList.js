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
const getCampaigns = environment.getCampaigns;

// web3
const web3 = require('../web3').web3;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('../contracts');
const classes = require('../contracts').classes;
const campaignRegistry = contracts.campaignRegistryContract;
const staffPicks = contracts.staffPicksContract;
const campaignDataRegistry = contracts.campaignDataRegistryContract;
const standardCampaignFactory = contracts.standardCampaignContractFactory;
const campaign = contracts.campaignContractFactory;

// loadCampaign method
const lib = require('../lib');
const getCampaignData = lib.getCampaign;
const getCampaignsData = lib.getCampaigns;

// router
const refreshPageButtons = require('../router').refreshPageButtons;

// require i18n
const t = require('../i18n').t;

// draw campaigns
const drawCampaigns = function(campaignsToDraw) {
  // reset inner html
  document.querySelector('#staffpicks_list').innerHTML = ``;
  document.querySelector('#campaigns_list').innerHTML = ``;

  // draw campaigns in list
  for(var campaignID = getCampaigns().length; campaignID >= 0; campaignID--){
    var campaignToDraw = campaignsToDraw[campaignID];
    var campaignDrawTarget = 'campaigns_list';

    // if campaign to draw is no undefined
    if (typeof campaignToDraw !== 'undefined') {

      // campaign is a staff pick, change draw target
      if (campaignToDraw.staffPick === true) {
        document.querySelector(`#staffpicks_list`).innerHTML += components.campaignHighlightMedium({campaignObject: campaignToDraw, web3: web3, getLocale: getLocale});
      } else {
        document.querySelector(`#campaigns_list`).innerHTML += components.campaignMedium({campaignObject: campaignToDraw, web3: web3, getLocale: getLocale});
      }
    }
  }

  refreshPageButtons();
};

// load all campaigns
const loadAndDrawCampaignsList = function() {
  // draw loader
  document.querySelector('#view-list').innerHTML = components.viewLoader();

  // load campaigns
  getCampaignsData({}, function(loadCampaignsError, loadCampaignsResult){
    // handle errors
    if (loadCampaignsError) {
      document.querySelector('#campaigns_list').innerHTML = `Error while loading campaigns ${JSON.stringify(loadCampaignsError)}`;
      return;
    }

    // draw campaigns page
    document.querySelector('#view-list').innerHTML = components.campaignsView();

    // if load result is nice
    if (typeof loadCampaignsResult === 'object') {
      Object.keys(loadCampaignsResult).forEach(function(campaignID){
        setCampaign(campaignID, loadCampaignsResult[campaignID]);

        // draw campaigns everytime
        drawCampaigns(getCampaigns());
      });
    }
  });
};

module.exports = loadAndDrawCampaignsList;
