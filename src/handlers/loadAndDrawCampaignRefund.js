// requires
import QRious from 'qrious';

// utils
import { log, etherScanAddressUrl, parseSolidityMethodName,
  etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';

// document helper
import { el } from '../document';

// require components
import { campaignRefundForm, campaignRefundReview, viewLoader } from '../components';

// environment
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';

// web3
import { web3 } from '../web3';
import { t } from '../i18n';

// loadCampaign method
import { getCampaigns } from 'weifund-lib';
import { getRouter, refreshPageButtons } from '../router';

// build all input sliders
import buildAllInputSliders from './drawAllInputSliders';
import handleCampaignRefund from './handleCampaignRefund';

// export module
module.exports = loadAndDrawCampaignRefund;

// draw campaign
function loadAndDrawCampaignRefund(campaignID, callback) {
  // draw loader
  el('#view-campaign-refund').innerHTML = viewLoader({ t });

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
      log('Campaign load while drawing...', campaignLoadError);
      callback(campaignLoadError, null);
      return;
    }

    // campaign data
    const campaignData = campaignDataObject[campaignID];

    // save in campaigns
    setCampaign(campaignID, campaignData);

    // draw campaign focus
    el('#view-campaign-refund').innerHTML = `
    ${campaignRefundForm({
      campaignObject: campaignData,
      defaultAccount: getDefaultAccount,
      web3,
    })}

    ${campaignRefundReview({
      campaignObject: campaignData,
      defaultAccount: getDefaultAccount,
      web3,
    })}

    <div id="view-campaign-refund-receipt"></div>
    `;

    // build all sliders
    buildAllInputSliders();

    // refresh all page buttons after redraw
    refreshPageButtons();

    // fire callback
    callback(null, 1);
  });
}
