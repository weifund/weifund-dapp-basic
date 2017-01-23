import QRious from 'qrious';
import { getCampaigns } from 'weifund-lib';

import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
   getLocale, getContractEnvironment, txObject } from '../environment';
import { campaignFocusView, viewLoader } from '../components';
import { el } from '../document';
import { web3 } from '../web3';
import { ipfs } from '../ipfs';
import { refreshPageButtons } from '../router';
import { t } from '../i18n';

// just draw the campaign
function drawCampaign(campaignLoadError, campaignDataObject, campaignID) {
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
}

export default function loadAndDrawCampaign(campaignID, callback) {
  // draw loader
  el('#view-focus').innerHTML = '';
  el('#view-focus').appendChild(viewLoader({ t }));

  const storedCampaignData = getCampaign(campaignID);

  // load campaign fresh to draw
  getCampaigns({
    network: getContractEnvironment(),

    selector: [campaignID],
  }, (err, result) => drawCampaign(err, result, campaignID));
}
