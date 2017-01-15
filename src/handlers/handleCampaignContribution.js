import { log, etherScanAddressUrl, etherScanTxHashUrl, oneDay } from 'weifund-util';
import Contracts from 'weifund-contracts';
import yo from 'yo-yo';

import { el } from '../document';
import { campaignContributeReceipt } from '../components';
import { setDefaultAccount, getCampaign, getNetwork, getLocale, txObject } from '../environment';
import { web3 } from '../web3';
import { t } from '../i18n';
import { getRouter } from '../router';

// require contracts
const contracts = new Contracts('ropsten', web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();
const campaign = contracts.Campaign.factory;


export default function handleCampaignContribution(){
  // get contribution value, and convert
  const selectedCampaignIdInput = parseInt(el('#campaign_id').value, 10);
  const selectedCampaign = getCampaign(selectedCampaignIdInput);
  const contributeValueInput =  el('#campaign_contributeAmount').value;
  const contributeValueWei = web3.toWei(contributeValueInput, 'ether');
  const campaignContractFactory = web3.eth.contract(selectedCampaign.abi);
  const campaignContractInstance = campaignContractFactory.at(selectedCampaign.addr);
  const contributeMethodName = selectedCampaign.contributeMethodABIObject.name;
  const contributeMethodInputParams = selectedCampaign.contributeMethodABIObject.inputs || [];
  const numContributeMethodInputParams = contributeMethodInputParams.length;
  const contributionIntervalTimeout = 60 * 1000; // 60 seconds
  const contributionReceiptIntervalLength = 1000;
  var contributionIntervalTimer = 0;
  var contributionParams = [[]]; // for the first arg

  // handle additional contribution inputs
  /* if (numContributeMethodInputParams > 0) {
    contributeMethodInputParams.forEach((inputParam, inputParamIndex) => {
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
  } */

  // confirmation message
  const confirmationMessage = `Contribution Confirmation:

Are you sure you want to contribute ${web3.fromWei(contributeValueWei, 'ether')} ether to the "${selectedCampaign.name}" campaign?
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

    // info response
    el('#campaign_contribute_info_response').style.display = '';
    el('#campaign_contribute_info_response').innerHTML = '';
    el('#campaign_contribute_info_response').appendChild(yo`<span>
      Your contribution transaction is awaiting approval...
    </span>`);

    web3.eth.getAccounts((err, result) => {
      console.log(err, result);
    });

    // build contribute params
    contributionParams.push(Object.assign({}, {
      value: contributeValueWei,
      from: txObject().from.slice(2),
      gas: txObject().gas,
    }));
    contributionParams.push((contributeError, contributeResultTxHash) => {
      resetReviewResponses();

      if (contributeError) {
        // make warning response under error
        el('#campaign_contribute_warning_response').style.display = '';
        el('#campaign_contribute_warning_response').innerHTML = '';
        el('#campaign_contribute_warning_response').appendChild(yo`<span>
        <h2 style="margin-top: 0px;">Error While Sending Transaction</h2>
        <p>
          There was an error while sending your contribution transaction:
          ${contributeError.toString()} ${String(JSON.stringify(contributeError, null, 2))}
        </p></span>`);
        return;
      }

      // if tx hash present
      if (contributeResultTxHash) {
        // info response
        el('#campaign_contribute_info_response').style.display = '';
        el('#campaign_contribute_info_response').innerHTML = '';
        el('#campaign_contribute_info_response').appendChild(yo`<span>
        Your contribution transaction is processing with transaction hash:

        ${contributeResultTxHash}

        -- checkout on
          <a target="_blank" href=${etherScanTxHashUrl(contributeResultTxHash, getNetwork())}>
            etherscan
          </a>
        </span>`);
      }

      // check transaction receipt
      const receiptInterval = setInterval(() => {
        web3.eth.getTransactionReceipt(contributeResultTxHash, (receiptError, receiptResult) => {

          // if error while getting receipt
          if (receiptError) {
            el('#campaign_contribute_warning_response').style.display = '';
            el('#campaign_contribute_warning_response').innerHTML = '';
            el('#campaign_contribute_warning_response').appendChild(yo`<span>
              There was an error while getting your transaction receipt:
                ${receiptError}
                ${String(JSON.stringify(receiptError, null, 2))}
                with transaction hash:
                ${contributeResultTxHash}
            </span>`);

            // resent review response
            resetReviewResponses();

            // clear receipt interval
            clearInterval(receiptInterval);
          }

          // display transaction receipt
          if (receiptResult) {
            // info response
            el('#campaign_contribute_info_response').style.display = '';
            el('#campaign_contribute_info_response').innerHTML = '';
            el('#campaign_contribute_info_response').appendChild(`<span>
              Your transaction was processed:
              ${JSON.stringify(receiptResult, null, 2)}
              with transaction hash:
              ${contributeResultTxHash}
            </span>`);

            // set contribution receipt
            el('#view-campaign-contribute-receipt').innerHTML = '';
            el('#view-campaign-contribute-receipt').appendChild(campaignContributeReceipt({
              receipt: receiptResult,
              from: txObject().from,
              to: selectedCampaign.addr,
              campaignObject: selectedCampaign,
              getLocale, web3,
            }));

            // resent review response
            resetReviewResponses();

            // clear receipt interval
            clearInterval(receiptInterval);

            // receipt page
            getRouter()(`/campaign/${selectedCampaign.id}/contribute/receipt`);
          }
        });

        // up timer by 1 second
        contributionIntervalTimer += contributionReceiptIntervalLength;

        // if interval checking expires
        if (contributionIntervalTimer >= contributionIntervalTimeout) {
          // timeout, reset review
          resetReviewResponses();

          // present response error
          el('#campaign_contribute_warning_response').style.display = '';
          el('#campaign_contribute_warning_response').innerHTML = '';
          el('#campaign_contribute_warning_response').appendChild(yo`<span>
            Contribution transaction checking timed out with transaction hash:
            ${contributeResultTxHash}.
            Your contribution either did not process or is taking a very long time to mine..
            Receipt interval polling has stopped.
          </span>`);

          // clear receipt interval
          clearInterval(receiptInterval);
        }
      }, contributionReceiptIntervalLength);
    });

    // contribute to campaign
    campaignContractInstance[contributeMethodName]
      .apply(campaignContractInstance, contributionParams);
  }
}
