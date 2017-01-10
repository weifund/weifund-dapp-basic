// utils
import { log, etherScanAddressUrl, etherScanTxHashUrl, oneDay } from 'weifund-util';

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
import Contracts from 'weifund-contracts';
const contracts = new Contracts('ropsten', web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();
const campaign = contracts.Campaign.factory;

// router instance
import { getRouter } from '../router';

// require i18n
import { t } from '../i18n';

// export method
module.exports = handleCampaignContribution;

// handle a campaign contribution
function handleCampaignContribution(event){
  // get contribution value, and convert
  const selectedCampaignIdInput = parseInt(el('#campaign_id').value);
  const selectedCampaign = getCampaign(selectedCampaignIdInput);
  const contributeValueInput =  el('#campaign_contributeAmount').value;
  const contributeValueWei = web3.toWei(contributeValueInput, 'ether');
  const campaignContractFactory = web3.eth.contract(selectedCampaign.abi);
  const campaignContractInstance = campaignContractFactory.at(selectedCampaign.addr);
  const contributeMethodName = selectedCampaign.contributeMethodABIObject.name;
  const contributeMethodInputParams = selectedCampaign.contributeMethodABIObject.inputs;
  const numContributeMethodInputParams = selectedCampaign.contributeMethodABIObject.inputs.length;
  const contributionIntervalTimeout = 180000; // 15 seconds
  const contributionReceiptIntervalLength = 1000;
  var contributionIntervalTimer = 0;
  var contributionParams = [];

  // contribute to weifund
  const weifundContributionAmount = el('#campaign_weifundContributeAmount').value;
  const weifundContributionAmountFloat = parseFloat(weifundContributionAmount);
  const weifundContributionAmountEther = web3.toWei(weifundContributionAmount, 'ether');

  // handle additional contribution inputs
  if (numContributeMethodInputParams > 0) {
    contributeMethodInputParams.forEach(function(inputParam, inputParamIndex) {
        // get input type and value
        const inputType = inputParam.type;
        const inputValue = el(`#campaign_contributionInput_${inputParamIndex}`).value;

        // handle contribute input data
        // bool to parseInt, everything else as a string
        if (inputType.indexOf('bool') !== -1) {
          contributionParams.push(parseInt(inputValue));
        } else {
          contributionParams.push(inputValue);
        }
    });
  }

  // confirmation message
  const confirmationMessage = `Contribution Confirmation:

Are you sure you want to contribute ${web3.fromWei(contributeValueWei, 'ether')} ether to the "${selectedCampaign.name}" campaign and make a second donation transaction of ${web3.fromWei(weifundContributionAmountEther, 'ether')} ether to WeiFund?

  WARNING:
  If you selected a donatation to WeiFUnd, this will create a second transaction. Do not be alarmed.
  `;

  // reset review responses
  const resetReviewResponses = function () {
    el('#campaign_contribute_info_response').style.display = 'none';
    el('#campaign_contribute_warning_response').style.display = 'none';
  }

  // contribute to campaign instance
  if (confirm(confirmationMessage)) {
    // awaiting tx approval message
    resetReviewResponses();
    el('#campaign_contribute_info_response').style.display = '';
    el('#campaign_contribute_info_response').innerHTML = `Your contribution transaction is awaiting approval...`;

    // build contribute params
    contributionParams.push(Object.assign({value: contributeValueWei}, txObject()));
    contributionParams.push(function(contributeError, contributeResultTxHash){
      if (contributeError) {
        resetReviewResponses();
        el('#campaign_contribute_warning_response').style.display = '';
        el('#campaign_contribute_warning_response').innerHTML = `There was an error while sending your contribution transaction: ${String(JSON.stringify(contributeError, null, 2))}`;
        return;
      }

      // if tx hash present
      if (contributeResultTxHash) {
        resetReviewResponses();
        el('#campaign_contribute_info_response').style.display = '';
        el('#campaign_contribute_info_response').innerHTML = `
        Your contribution transaction is processing with transaction hash:

        ${contributeResultTxHash}

        -- checkout on <a target="_blank" href="${etherScanTxHashUrl(contributeResultTxHash, getNetwork())}">etherscan</a>`;
      }

      // check transaction receipt
      const receiptInterval = setInterval(function(){
        web3.eth.getTransactionReceipt(contributeResultTxHash, function(receiptError, receiptResult){
          if (receiptError) {
            resetReviewResponses();
            el('#campaign_contribute_warning_response').style.display = '';
            el('#campaign_contribute_warning_response').innerHTML = `There was an error while getting your transaction receipt: ${String(JSON.stringify(receiptError, null, 2))} with transaction hash: ${contributeResultTxHash}`;

            // clear receipt interval
            clearInterval(receiptInterval);
          }

          console.log('Transaction Receipt', contributeResultTxHash, receiptResult, receiptError);

          // display transaction receipt
          if (receiptResult) {
            if (receiptResult.blockNumber !== null) {
              resetReviewResponses();
              el('#campaign_contribute_info_response').style.display = '';
              el('#campaign_contribute_info_response').innerHTML = `Your transaction was processed: ${JSON.stringify(receiptResult, null, 2)} with transaction hash: ${contributeResultTxHash}`;

              el('#view-campaign-contribute-receipt').innerHTML = components.campaignContributeReceipt({receipt: receiptResult, from: txObject().from, to: selectedCampaign.addr, campaignObject: selectedCampaign, getLocale: getLocale, web3: web3});

              // clear receipt interval
              clearInterval(receiptInterval);

              // receipt page
              getRouter()(`/campaign/${selectedCampaign.id}/contribute/receipt`);
            }
          }
        });

        // up timer by 1 second
        contributionIntervalTimer += contributionReceiptIntervalLength;

        // if interval checking expires
        if (contributionIntervalTimer >= contributionIntervalTimeout) {
          resetReviewResponses();
          el('#campaign_contribute_warning_response').style.display = '';
          el('#campaign_contribute_warning_response').innerHTML = `Contribution transaction checking timed out with transaction hash: ${contributeResultTxHash}. Your contribution either did not process or is taking a very long time to mine.. Receipt interval polling has stopped.`;

          // clear receipt interval
          clearInterval(receiptInterval);
        }
      }, contributionReceiptIntervalLength);
    });

    // send weifund tx
    if (parseFloat(weifundContributionAmount) > 0) {
      web3.eth.sendTransaction(Object.assign({value: weifundContributionAmountEther}, txObject()), function(weifundContributionError, weifundContributionTxHash){
        console.log('WeiFund contribution', weifundContributionError, weifundContributionTxHash);
      });
    }

    // contribute to campaign
    campaignContractInstance[contributeMethodName].apply(campaignContractInstance, contributionParams);
  }
}
