import QRious from 'qrious';
import { log, etherScanAddressUrl, parseSolidityMethodName,
  etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';
import { getCampaigns } from 'weifund-lib';

import { el } from '../document';
import { campaignRefundForm, campaignRefundReview, viewLoader } from '../components';
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';
import { web3 } from '../web3';
import { t } from '../i18n';
import { getRouter, refreshPageButtons } from '../router';
import buildAllInputSliders from './drawAllInputSliders';
import handleCampaignRefund from './handleCampaignRefund';


export default function loadAndDrawCampaignRefund(campaignID, callback) {
  // draw loader
  el('#view-campaign-refund').innerHTML = '';
  el('#view-campaign-refund').appendChild(viewLoader({ t }));

  // load campaign fresh to draw
  getCampaigns({
    // set network
    // or 'testnet'
    network: getContractEnvironment(),

    // set campaign selector
    // array (i.e. array of campaignIDs)
    selector: [campaignID],
  }, (campaignLoadError, campaignDataObject) => {
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
    el('#view-campaign-refund').innerHTML = '';
    el('#view-campaign-refund').appendChild(yo`
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
    `);

    // build all sliders
    buildAllInputSliders();

    // refresh all page buttons after redraw
    refreshPageButtons();

    // fire callback
    callback(null, 1);
  });
}
