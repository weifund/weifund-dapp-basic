// utils
import { log, etherScanAddressUrl, etherScanTxHashUrl } from 'weifund-util';

// document helper
import { el } from '../document';

// require components
import { campaignHighlightMedium, viewLoader, campaignsView } from '../components';

// environment
import { setDefaultAccount, getDefaultAccount, getStoredCampaigns, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';

// require web3 i18n  router  loadCampaign method
import { getCampaigns } from 'weifund-lib';
import { refreshPageButtons } from '../router';
import { t } from '../i18n';
import { web3 } from '../web3';

// require contracts
import Contracts from 'weifund-contracts';
const contracts = new Contracts('ropsten', web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();
const curationRegistry = contracts.CurationRegistry.instance();

// export method
module.exports = loadAndDrawCampaignsList;

// draw campaigns
function drawCampaigns(campaignsToDraw) {
  // reset inner html
  el('#staffpicks_list').innerHTML = ``;
  el('#campaigns_list').innerHTML = ``;

  // draw campaigns in list
  for(var campaignID = campaignsToDraw.length - 1; campaignID >= 0; campaignID--){
    var campaignToDraw = campaignsToDraw[campaignID];
    var campaignDrawTarget = 'campaigns_list';

    // if campaign to draw is no undefined
    if (typeof campaignToDraw !== 'undefined') {
      // campaign is a staff pick, change draw target
      if (campaignToDraw.staffPick === true) {
        el(`#staffpicks_list`).appendChild(campaignHighlightMedium({
          campaignObject: campaignToDraw,
          web3,
          getLocale,
          t,
        }));
      } else {
        el(`#campaigns_list`).appendChild(campaignHighlightMedium({
          campaignObject: campaignToDraw,
          web3,
          getLocale,
          t,
        }));
      }
    }
  }

  // refresh page buttons
  refreshPageButtons();
}

// load all campaigns
function loadAndDrawCampaignsList() {
  // the campaign id selector array
  var selectorArray = [];

  // draw loader
  el('#view-list').innerHTML = '';
  el('#view-list').appendChild(viewLoader({ t }));

  // get the number of campaigns then load campaigns list accordingly
  campaignRegistry.numCampaigns(function(numCampaignsError, numCampaignsResult){
    if (numCampaignsError) {
      alert(`Error while loading campaigns ${numCampaignsError} ${JSON.stringify(numCampaignsError)}`);
      return;
    }

    // build selector array, select all campaigns
    for(var cid = 0; cid < numCampaignsResult.toNumber(10); cid++) {
      selectorArray.push(cid);
    }

    // load campaigns
    getCampaigns({
      // set network
      // or 'testnet'
      network: getContractEnvironment(),

      // set campaign selector
      // array (i.e. array of campaignIDs)
      selector: [0],
    }, function(loadCampaignsError, loadCampaignsResult){

      // handle errors
      if (loadCampaignsError) {
        el('#campaigns_list').innerHTML =
        el('#campaigns_list').appendChild(yo`
          Error while loading campaigns ${JSON.stringify(loadCampaignsError)}
        `);
        return;
      }

      // draw campaigns page
      el('#view-list').innerHTML = '';
      el('#view-list').appendChild(campaignsView({ t }));

      // if load result is nice
      if (typeof loadCampaignsResult === 'object') {
        Object.keys(loadCampaignsResult).forEach(function(campaignID){
          setCampaign(campaignID, loadCampaignsResult[campaignID]);

          // draw campaigns everytime
          drawCampaigns(getStoredCampaigns());
        });
      }
    });
  });
}
