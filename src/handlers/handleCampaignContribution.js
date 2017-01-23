import { log, etherScanAddressUrl, etherScanTxHashUrl, oneDay } from 'weifund-util';
import Contracts from 'weifund-contracts';
import yo from 'yo-yo';
import BigNumber from 'bignumber.js';

import { el } from '../document';
import { campaignContributeReceipt } from '../components';
import { setDefaultAccount, getContractEnvironment, getCampaign, getNetwork, getLocale, txObject } from '../environment';
import { web3 } from '../web3';
import { t } from '../i18n';
import { getRouter } from '../router';

// require contracts
const contracts = new Contracts(getContractEnvironment(), web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();
const campaign = contracts.StandardCampaign.factory;


// reset review responses
function resetReviewResponses() {
  el('#campaign_contribute_info_response').style.display = 'none';
  el('#campaign_contribute_warning_response').style.display = 'none';
}

export default function handleCampaignContribution(){
  // get contribution value, and convert
  const selectedCampaignIdInput = parseInt(el('#campaign_id').value, 10);
  const selectedCampaign = getCampaign(selectedCampaignIdInput);
  const contributeValueInput = new BigNumber(el('#campaign_contributeAmount').value);
  const contributeValueWei = new BigNumber(web3.toWei(contributeValueInput, 'ether'));
  const campaignContractFactory = web3.eth.contract(selectedCampaign.abi);
  const campaignContractInstance = campaignContractFactory.at(selectedCampaign.addr);
  const contributeMethodName = selectedCampaign.contributeMethodABIObject.name;
  const contributeMethodInputParams = selectedCampaign.contributeMethodABIObject.inputs || [];
  const numContributeMethodInputParams = contributeMethodInputParams.length;
  const contributionIntervalTimeout = 90 * 1000; // 60 seconds
  const contributionReceiptIntervalLength = 1000;
  var contributionIntervalTimer = 0;
  var contributionParams = []; // for the first arg

  // confirmation message
  const confirmationMessage = `Contribution Confirmation:

Are you sure you want to contribute ${web3.fromWei(contributeValueWei, 'ether')} ether to the "${selectedCampaign.name}" campaign?
`;

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

    console.log(Object.assign({}, {
      value: contributeValueWei.toFixed(0),
      from: txObject().from.slice(2),
      gasPrice: web3.toWei('0.00000002', 'ether').toString(10),
      gas: txObject().gas,
    }));

    // build contribute params
    contributionParams.push([]); // for the empty contribution
    contributionParams.push(Object.assign({}, {
      value: contributeValueWei.toFixed(0),
      from: txObject().from.slice(2),
      gasPrice: web3.toWei('0.00000002', 'ether').toString(10),
      gas: txObject().gas,
    }));
    contributionParams.push((contributeError, contributeResultTxHash) => {
      resetReviewResponses();

      if (contributeError) {
        resetReviewResponses();

        // make warning response under error
        el('#campaign_contribute_warning_response').style.display = 'block';
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
        resetReviewResponses();

        // info response
        el('#campaign_contribute_info_response').style.display = 'block';
        el('#campaign_contribute_info_response').innerHTML = '';
        el('#campaign_contribute_info_response').appendChild(yo`<span>
        Your contribution transaction is processing with transaction hash:

        ${contributeResultTxHash}

        -- checkout on
          <a target="_blank"
            style="color: #FFF; text-decoration: underline;"
            href=${etherScanTxHashUrl(contributeResultTxHash, getNetwork())}>
            etherscan
          </a>
        </span>`);
      }

      // check transaction receipt
      const receiptInterval = setInterval(() => {
        web3.eth.getTransactionReceipt(contributeResultTxHash, (receiptError, receiptResult) => {

          // if error while getting receipt
          if (receiptError) {
            resetReviewResponses();

            el('#campaign_contribute_warning_response').style.display = 'block';
            el('#campaign_contribute_warning_response').innerHTML = '';
            el('#campaign_contribute_warning_response').appendChild(yo`<span>
              There was an error while getting your transaction receipt:
                ${receiptError}
                ${String(JSON.stringify(receiptError, null, 2))}
                with transaction hash:
                ${contributeResultTxHash}
            </span>`);

            // clear receipt interval
            clearInterval(receiptInterval);
          }

          // display transaction receipt
          if (receiptResult) {
            if (receiptResult.logs.length === 0) {
              resetReviewResponses();

              el('#campaign_contribute_warning_response').style.display = 'block';
              el('#campaign_contribute_warning_response').innerHTML = '';
              el('#campaign_contribute_warning_response').appendChild(yo`<span>
                <h3 style="margin-top: 0px;">Transaction Error</h3>
                <p>
                There was an error while getting your transaction receipt,
                no logs were found in receipt, indicating an invalid transaction
                with transaction hash: ${contributeResultTxHash}.

                <hr />

                This could mean several things:
                <br />
                (1) The token cap is being exceeded<br />
                (2) The camaign funding cap is being exceeded<br />
                (3) The campaign has expired<br />
                (4) The campaign has failed<br />
                (5) The campaign has succeeded<br />
                (6) You did not contribute enough to equate to one token<br />
                (7) Your contribution was not a factor of the token price (0.125 ether)
                <br /><br /><br />

                Please try your contribution again.<br /><br /><br />

                -- checkout on
                  <a target="_blank"
                    style="color: #FFF; text-decoration: underline;"
                    href=${etherScanTxHashUrl(contributeResultTxHash, getNetwork())}>
                    etherscan
                  </a>
                </p>
              </span>`);

              // clear receipt interval
              clearInterval(receiptInterval);

              return;
            }

            // info response
            el('#campaign_contribute_info_response').style.display = 'block';
            el('#campaign_contribute_info_response').innerHTML = '';
            el('#campaign_contribute_info_response').appendChild(yo`<span>
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
            history.pushState({}, null, `/campaign/${selectedCampaign.id}/contribute/receipt`);
          }
        });

        // up timer by 1 second
        contributionIntervalTimer += contributionReceiptIntervalLength;

        // if interval checking expires
        if (contributionIntervalTimer >= contributionIntervalTimeout) {
          // timeout, reset review
          resetReviewResponses();

          // present response error
          el('#campaign_contribute_warning_response').style.display = 'block';
          el('#campaign_contribute_warning_response').innerHTML = '';
          el('#campaign_contribute_warning_response').appendChild(yo`<span>
            Contribution transaction checking timed out with transaction hash:
            ${contributeResultTxHash}.
            Your contribution either did not process or is taking a very long time to mine..
            Receipt interval polling has stopped.

            <hr />

            This could mean several things:

            <br />

            (1) The token cap is being exceeded<br />
            (2) The camaign funding cap is being exceeded<br />
            (3) The campaign has expired<br />
            (4) The campaign has failed<br />
            (5) The campaign has succeeded<br />
            (6) You did not contribute enough to equate to one token<br />
            (7) Your contribution was not a factor of the token price (0.125 ether)<br />

            <hr />

            <button class="btn btn-primary"
              href=${`/campaign/${selectedCampaignIdInput}/contribute/`}>
              Try Again
            </button>
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
