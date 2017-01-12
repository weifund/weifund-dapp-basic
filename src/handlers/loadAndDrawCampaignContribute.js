// utils
import { log, etherScanAddressUrl, parseSolidityMethodName,
  parseSolidityMethodInterface, etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';

// document helper
import { el } from '../document';

// require components
import { campaignContributeView, viewLoader } from '../components';

// environment
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';

// web3
// loadCampaign method
import { web3 } from '../web3';
import { ipfs } from '../ipfs';
import { getCampaigns } from 'weifund-lib';
import { getRouter, refreshPageButtons } from '../router';
import { t } from '../i18n';

// require contracts
import Contracts from 'weifund-contracts';
const contracts = new Contracts('ropsten', web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();

// handle cmapaign contribution
// build all input sliders
import handleCampaignContribution from './handleCampaignContribution';
import handleGenerateWallet from './handleGenerateWallet';
import handleVerifySeed from './handleVerifySeed';
import buildAllInputSliders from './drawAllInputSliders';

// export method
module.exports = loadAndDrawCampaignContribute;

// main export
function updateCampaignContributeReview() {
  const campaignContributeID = el('#campaignFormID').value;
  const contributeAmount = el('#campaign_contributeAmount').value;
  const weifundContributeAmount = el('#campaign_weifundContributeAmount').value;
  var contributeTotal = parseFloat(contributeAmount, 10) + parseFloat(weifundContributeAmount, 10);

  if (isNaN(contributeTotal)) {
    contributeTotal = 0;
  }

  // parse float
  if (parseFloat(contributeAmount, 10) === 0) {
    el('#campaign-contribute-review-button').href = ``;
    el('#campaign_contributeAmountGroup').style.border = `red solid 1px`;
    el('#campaign_contributeAmount').focus();
    el('#campaign_contributeAmount').blur();
    return;
  } else {
    el('#campaign-contribute-review-button').href = `/campaign/${campaignContributeID}/contribute/review`;
    el('#campaign_contributeAmountGroup').style.border = `none`;
  }

  // disclaimer check
  if (!el('#campaign-contribute-disclaimer').checked) {
    el('#campaign-contribute-review-button').href = ``;
    el('#campaign-contribute-disclaimer').style.border = `red solid 1px`;
    el('#campaign-contribute-disclaimer').focus();
    el('#campaign-contribute-disclaimer').blur();
    return;
  } else {
    el('#campaign-contribute-review-button').href = `/campaign/${campaignContributeID}/contribute/review`;
    el('#campaign-contribute-disclaimer').style.border = `none`;
  }

  // if contribution greater than zero
  if (parseFloat(weifundContributeAmount, 10) > 0) {
    el('#campaign_contributeReview_transactionTotal').innerHTML = 2;
  } else {
    el('#campaign_contributeReview_transactionTotal').innerHTML = 1;
  }

  el('#campaign_contributeReview_contributeAmount').innerHTML = contributeAmount;
  el('#campaign_contributeReview_weifundContributeAmount').innerHTML = weifundContributeAmount;
  el('#campaign_contributeReview_totalContributeAmount').innerHTML = contributeTotal;
};

// load and draw campaign contribute page/flow
function loadAndDrawCampaignContribute(campaignID, callback) {
  // handle empty callback
  if (typeof callback !== 'function') {
    callback = function(e, r) {};
  }

  // draw loader
  el('#view-campaign-contribute').innerHTML = '';
  el('#view-campaign-contribute').appendChild(viewLoader({ t }));

  // load campaign fresh to draw
  getCampaigns({
    // set network
    // or 'testnet'
    network: getContractEnvironment(),

    // set campaign selector
    // array (i.e. array of campaignIDs)
    selector: [campaignID],
  }, function(campaignLoadError, campaignDataObject){
    if (campaignLoadError) {
      alert('Campaign load while drawing...', campaignLoadError);
      callback(campaignLoadError, null);
      return;
    }

    // campaign data
    const campaignData = campaignDataObject[campaignID];

    // campaign data undefined
    if (typeof campaignData === 'undefined') {
      alert('Problem while loading campaign.. no campaign data available..');
      return;
    }

    // save in campaigns
    setCampaign(campaignID, campaignData);

    // draw campaign focus
    el('#view-campaign-contribute').innerHTML = '';
    el('#view-campaign-contribute').appendChild(campaignContributeView({
      campaignObject: campaignData,
      getLocale,
      web3,
      defaultAccount: getDefaultAccount,
    }));

    // get latest account balance
    /* web3.eth.getBalance(getDefaultAccount(), function(balanceError, balanceResult) {
      console.log(balanceError, balanceResult, el('#defaultAccountBalance'));

      if (!balanceError) {
        el('#defaultAccountBalance').innerHTML = web3.fromWei(balanceResult, 'ether');
      }
    }); */

    // initially update review page
    updateCampaignContributeReview();

    // weifund amount contributor amount
    el('#campaign_weifundContributeAmount').addEventListener('change', updateCampaignContributeReview);

    // weifund amount contributor amount
    el('#campaign_contributeAmount').addEventListener('change', updateCampaignContributeReview);

    // update form when disclaimer is checked
    el('#campaign-contribute-disclaimer').addEventListener('change', updateCampaignContributeReview);

    // handleCampaignContribution
    el('#campaign_reviewContributeButton').addEventListener('click', handleCampaignContribution);

    el('#view-campaign-contribute-wallet a.generate').addEventListener('click', handleGenerateWallet);
    el('#view-campaign-contribute-wallet-confirm input[type=text]').addEventListener('keyup', handleVerifySeed);

    /*

    INSERT WALLET LISTENERS/LOGIC HERE

    */

    // handle button click/disclaimer
    // el('#campaign-contribute-disclaimer')
    // el('#campaign-contribute-disclaimer').checked
    // el('#campaign-contribute-review-button')

    // reset contribute inputs dom draw
    //el('#campaignContribution_inputs').innerHTML = '';
    var campaignContributionInputHTML = ``;

    /*
    // draw contribution inputs
    campaignData.contributeMethodABIObject.inputs.forEach(function(contributeInput, contributeInputIndex) {

      // set default dom ID and input type
      const contributionInputID = `campaign_contributionInput_${contributeInputIndex}`;
      var contirbutionInputType = 'text';

      // if type is numerical
      if (String(contributeInput.type).indexOf('int') !== -1) {
        contirbutionInputType = 'number';
      }

      // is type a bool
      if (contributeInput.type === 'bool') {
        contirbutionInputType = 'bool';
      }

      campaignContributionInputHTML += `

      <br />

      <h3>${parseSolidityMethodName(contributeInput.name)}*</h3>
      <h4>This is a custom campaign input. The campaign operator has not set a description for this input.</h4>

      <br />

      `;

      // if type is a bool
      if (contirbutionInputType === 'bool') {
        campaignContributionInputHTML += `

        <div class="row">
          <div class="col-xs-12 col-sm-12">
            <select id="${contributionInputID}" placeholder="${contributeInput.name}">
              <option value="0">False (no)</option>
              <option value="1">True (yes)</option>
             </select>
          </div>
        </div>

         `;
      } else if (contirbutionInputType === 'number') {
        campaignContributionInputHTML += `

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-8">
            <div class="input-slider input-slider-lg" data-input-id="campaign_input_1">
              <div class="input-slider-rail">
                <div class="input-slider-rail-highlight"></div>
                <div class="input-slider-bar"></div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="input-group">
              <input type="text" id="${contributionInputID}" class="form-control input-lg" placeholder="i.e. 400" aria-describedby="basic-addon2" />
              <span class="input-group-addon" id="basic-addon2">gnosis</span>
            </div>
          </div>
        </div>

        `;
      } else {
        campaignContributionInputHTML += `

        <div class="row">
          <div class="col-xs-12 col-sm-12">
            <input type="${contirbutionInputType}" id="${contributionInputID}" placeholder="${parseSolidityMethodName(contributeInput.name)}" />
          </div>
        </div>

        `;
      }
    });
    */

    // set campaign contribution custom inputs
    // el('#campaignContribution_inputs').innerHTML = campaignContributionInputHTML;

    // refresh all page buttons after redraw
    refreshPageButtons();

    callback(null, true);

    // build all sliders
    buildAllInputSliders();
  });
}
