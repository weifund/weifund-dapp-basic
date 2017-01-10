// utils
import { log, etherScanAddressUrl, etherScanTxHashUrl } from 'weifund-util';

// document helper
import { el } from '../document';

// require components
import components from '../components';

// environment
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';

// web3
import { web3 } from '../web3';

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const Contracts = require('weifund-contracts');
const contracts = new Contracts('ropsten', web3.currentProvider);
const classes = contracts.contracts;
const campaignRegistry = contracts.CampaignRegistry.instance();
const campaignDataRegistry = contracts.CampaignDataRegistry.instance();
const standardCampaignFactory = contracts.StandardCampaign.factory;
const campaign = contracts.Campaign.factory;

// router
const refreshPageButtons = require('../router').refreshPageButtons;

// require i18n
import { t } from '../i18n';

const registerCampaign = function(campaignAddress) {
  campaignRegistry.register(campaignAddress, '', txObject(), function(registerError, registerTxHash){
    console.log(registerError, registerTxHash);
  });
};

// register a campaign with the weifund registry
const handleCampaignRegistration = function(){
  const campaignAddress = el('#registerCampaign_campaign').value;
  const campaignInterface =  el('#registerCampaign_interface').value;

  // awaiting tx approval
  el('#registerCampaign_response').innerHTML = `Awaiting transaction approval for campaign registry...`;

  // send register tx
  campaignRegistry.register(campaignAddress, campaignInterface, txObject(), function(registerError, registerTxHash){
    // handle registry error
    if (registerError) {
      el('#registerCampaign_response').innerHTML = `There was an error while registering your campaign: ${registerError}`;
      return;
    }

    // positive message
    el('#registerCampaign_response').innerHTML = `Registering your campaign with the WeiFund registry... your TX hash is: ${registerTxHash}`;

    // listen for registry tx
    // campaign focus buttons
    campaignRegistry.CampaignRegistered({_campaign: campaignAddress}, function(registerEventError, registerEventResult) {
      if (registerEventError) { // handle error loudly
        el('#registerCampaign_response').innerHTML = `There was an error while registering your campaign: [event] ${registerEventError}`;
        return;
      }

      // positive message
      el('#registerCampaign_response').innerHTML = `Your campaign has been registered with the WeiFund registry!   ${registerEventResult.transactionHash}`;
    });
  });
};

module.exports = handleCampaignRegistration;
