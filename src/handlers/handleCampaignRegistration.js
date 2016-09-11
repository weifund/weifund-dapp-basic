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
const setCampaign = environment.setCampaign;

// web3
const web3 = require('../web3').web3;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('weifund-contracts');
const classes = require('weifund-contracts').classes;
const campaignRegistry = contracts.CampaignRegistry(web3, getNetwork());
const staffPicks = contracts.StaffPicks(web3, getNetwork());
const campaignDataRegistry = contracts.CampaignDataRegistry(web3, getNetwork());
const standardCampaignFactory = contracts.factories.StandardCampaign(web3);
const campaign = contracts.factories.Campaign(web3);

// router
const refreshPageButtons = require('../router').refreshPageButtons;

// require i18n
const t = require('../i18n').t;

// register a campaign with the weifund registry
const handleCampaignRegistration = function(){
  const campaignAddress = document.querySelector('#registerCampaign_campaign').value;
  const campaignInterface =  document.querySelector('#registerCampaign_interface').value;

  // awaiting tx approval
  document.querySelector('#registerCampaign_response').innerHTML = `Awaiting transaction approval for campaign registry...`;

  // send register tx
  campaignRegistry.register(campaignAddress, campaignInterface, txObject(), function(registerError, registerTxHash){
    // handle registry error
    if (registerError) {
      document.querySelector('#registerCampaign_response').innerHTML = `There was an error while registering your campaign: ${registerError}`;
      return;
    }

    // positive message
    document.querySelector('#registerCampaign_response').innerHTML = `Registering your campaign with the WeiFund registry... your TX hash is: ${registerTxHash}`;

    // listen for registry tx
    // campaign focus buttons
    campaignRegistry.CampaignRegistered({_campaign: campaignAddress}, function(registerEventError, registerEventResult) {
      if (registerEventError) { // handle error loudly
        document.querySelector('#registerCampaign_response').innerHTML = `There was an error while registering your campaign: [event] ${registerEventError}`;
        return;
      }

      // positive message
      document.querySelector('#registerCampaign_response').innerHTML = `Your campaign has been registered with the WeiFund registry!   ${registerEventResult.transactionHash}`;
    });
  });
};

module.exports = handleCampaignRegistration;
