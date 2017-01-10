// utils
import { log, etherScanAddressUrl, etherScanTxHashUrl } from 'weifund-util';

// document helper
import { el } from '../document';

// environment
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';

// web3
import { web3 } from '../web3';

// require contracts
// setup campaign and data registries
// Campaign/token contracts
import Contracts from 'weifund-contracts';
const contracts = new Contracts('ropsten', web3.currentProvider);
const campaign = contracts.Campaign.factory;

// require i18n
import { t } from '../i18n';

// export method
module.exports = handleCampaignPayout;

// handle payout
function handleCampaignPayout(event){
  // payout awaiting approval
  el('#payout_response').innerHTML = `Your campaign payout transaction is awaiting approval..`;

  // get campaign for payout
  const selectedCampaignIdInput = parseInt( el('#campaign_id').value);
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
      el('#payout_response').innerHTML = `There was an error while paying out your campaign:  ${String(JSON.stringify(payoutError, null, 2))}`;
    }

    // if tx hash present
    if (payoutResultTxHash) {
      el('#payout_response').innerHTML = `Your payout transaction is processing with transaction hash:  ${payoutResultTxHash}`;
    }
  });

  // contribute to campaign instance
  campaignContractInstance[payoutMethodName].apply(campaignContractInstance, payoutParams);
}
