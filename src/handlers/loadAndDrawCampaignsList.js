// utils
const utils = require('weifund-util');
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
const getStoredCampaigns = environment.getCampaigns;
const setCampaign = environment.setCampaign;

// web3
const web3 = require('../web3').web3;

// web3
const ipfs = require('../ipfs').ipfs;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('weifund-contracts');
const campaignRegistry = contracts.CampaignRegistry(web3, getNetwork());
const staffPicks = contracts.StaffPicks(web3, getNetwork());

// loadCampaign method
const lib = require('weifund-lib');
const getCampaigns = lib.getCampaigns;

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
  for(var campaignID = getStoredCampaigns().length; campaignID >= 0; campaignID--){
    var campaignToDraw = campaignsToDraw[campaignID];
    var campaignDrawTarget = 'campaigns_list';

    // if campaign to draw is no undefined
    if (typeof campaignToDraw !== 'undefined') {

      // campaign is a staff pick, change draw target
      if (campaignToDraw.staffPick === true) {
        document.querySelector(`#staffpicks_list`).innerHTML += components.campaignHighlightMedium({campaignObject: campaignToDraw, web3: web3, getLocale: getLocale, t: t});
      } else {
        document.querySelector(`#campaigns_list`).innerHTML += components.campaignHighlightMedium({campaignObject: campaignToDraw, web3: web3, getLocale: getLocale, t: t});
      }
    }
  }

  refreshPageButtons();
};

// load all campaigns
const loadAndDrawCampaignsList = function() {
  // the campaign id selector array
  var selectorArray = [];

  // draw loader
  document.querySelector('#view-list').innerHTML = components.viewLoader({t: t});

  // get the number of campaigns then load campaigns list accordingly
  campaignRegistry.numCampaigns(function(numCampaignsError, numCampaignsResult){
    if (numCampaignsError) {
      document.querySelector('#campaigns_list').innerHTML = `Error while loading campaigns ${JSON.stringify(numCampaignsError)}`;
      return;
    }

    // build selector array, select all campaigns
    for(var cid = 0; cid < numCampaignsResult.toNumber(10); cid++) {
      selectorArray.push(cid);
    }

    // load campaigns
    getCampaigns({
      // set network
      // or 'testnet'
      network: getNetwork(),

      // set campaign selector
      // array (i.e. array of campaignIDs)
      selector: [28,29],

      // set web3 provider
      web3Provider: web3.currentProvider,

      // set ipfs provider
      ipfsProvider: ipfs.currentProvider,
    }, function(loadCampaignsError, loadCampaignsResult){

      // handle errors
      if (loadCampaignsError) {
        document.querySelector('#campaigns_list').innerHTML = `Error while loading campaigns ${JSON.stringify(loadCampaignsError)}`;
        return;
      }

      // draw campaigns page
      document.querySelector('#view-list').innerHTML = components.campaignsView({t: t});

      // if load result is nice
      if (typeof loadCampaignsResult === 'object') {
        console.log(loadCampaignsResult, Object.keys(loadCampaignsResult).length);
        Object.keys(loadCampaignsResult).forEach(function(campaignID){
          setCampaign(campaignID, loadCampaignsResult[campaignID]);

          // draw campaigns everytime
          drawCampaigns(getStoredCampaigns());
        });
      }
    });
  });
};

module.exports = loadAndDrawCampaignsList;
