// utils
const utils = require('../utils/');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;

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
const campaign = contracts.campaignContractFactory;

// loadCampaign method
const lib = require('../lib');
const getCampaignData = lib.getCampaign;
const getCampaignsData = lib.getCampaigns;

// require i18n
const t = require('../i18n').t;

// handle payout
const handleCampaignPayout = function(event){
  // payout awaiting approval
  document.querySelector('#payout_response').innerHTML = `Your campaign payout transaction is awaiting approval..`;

  // get campaign for payout
  const selectedCampaignIdInput = parseInt( document.querySelector('#campaign_id').value);
  const selectedCampaign = getCampaign(selectedCampaignIdInput);

  // build contract factory, instance
  const campaignContractFactory = web3.eth.contract(selectedCampaign.abi);
  const campaignContractInstance = campaignContractFactory.at(selectedCampaign.addr);
  const payoutMethodName = selectedCampaign.payoutMethodABIObject.name;
  var payoutParams = [];

  // note:
  // add additional payout params here, if any..

  // add tx object and callback
  payoutParams.push(txObject());
  payoutParams.push(function(payoutError, payoutResultTxHash){
    if (payoutError) {
      document.querySelector('#payout_response').innerHTML = `There was an error while paying out your campaign:  ${String(JSON.stringify(payoutError, null, 2))}`;
    }

    // if tx hash present
    if (payoutResultTxHash) {
      document.querySelector('#payout_response').innerHTML = `Your payout transaction is processing with transaction hash:  ${payoutResultTxHash}`;
    }
  });

  // contribute to campaign instance
  campaignContractInstance[payoutMethodName].apply(campaignContractInstance, payoutParams);
};

module.exports = handleCampaignPayout;
