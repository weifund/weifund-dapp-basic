// requires
import QRious from 'qrious';

// environment and components
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';
import { campaignFocusView, viewLoader } from '../components';

// document helper
import { el } from '../document';

// web3, ipfs
import { web3 } from '../web3';
import { ipfs } from '../ipfs';

// loadCampaign method
import { getCampaigns } from 'weifund-lib';

// router instance
import { refreshPageButtons } from '../router';

// require i18n
import { t } from '../i18n';

// export load and draw campaign
module.exports = loadAndDrawCampaign;

// draw campaign
function loadAndDrawCampaign(campaignID, callback) {
  // draw loader
  el('#view-focus').innerHTML = '';
  el('#view-focus').appendChild(viewLoader({ t }));

  // load campaign fresh to draw
  getCampaigns({
    network: 'ropsten',

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

    // a reload instance to be fired later if need be
    function reload() {
      loadAndDrawCampaign(campaignID);
    }

    // draw campaign focus
    el('#view-focus').innerHTML = '';
    el('#view-focus').appendChild(campaignFocusView({
      campaignObject: campaignData,
      reload,
      web3,
      getLocale,
      t,
    }));

    // draw qr code
    const qr = new QRious({
      element: el('#campaign_qrcode'),
      size: 250,
      value: campaignData.addr,
    });

    // refresh all page buttons after redraw
    refreshPageButtons();
  });
}
