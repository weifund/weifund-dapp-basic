// utils
import { log, etherScanAddressUrl, parseSolidityMethodName,
  etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';

// document helper
import { el } from '../document';

// environment and components
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';
import components from '../components';

// web3
import { web3 } from '../web3';
import { ipfs } from '../ipfs';
import { t } from '../i18n';

// loadCampaign method
import { getCampaigns } from 'weifund-lib';
import { refreshPageButtons } from '../router';

// draw utils
import buildAllInputSliders from './drawAllInputSliders';

// export single method
module.exports = loadAndDrawCampaignPayout;

// payout handler
function loadAndDrawCampaignPayout(campaignID, callback) {
  // handle empty callback
  if (typeof callback !== 'function') {
    callback = function(e, r) {};
  }

  // draw loader
  el('#view-campaign-payout').innerHTML = components.viewLoader({t: t});

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
    el('#view-campaign-payout').innerHTML = components.campaignPayoutView({
      campaignObject: campaignData,
      getLocale,
    });

    // refresh all page buttons after redraw
    refreshPageButtons();

    // build all sliders
    buildAllInputSliders();

    // callback
    callback(null, true);
  });
}
