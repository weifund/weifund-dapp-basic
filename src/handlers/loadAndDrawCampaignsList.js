import { log, etherScanAddressUrl, etherScanTxHashUrl } from 'weifund-util';
import Contracts from 'weifund-contracts';
import { getCampaigns } from 'weifund-lib';
import BigNumber from 'bignumber.js';
import stateSnapshot from '../getCampaignsState.json';
import yo from 'yo-yo';

import { el } from '../document';
import { campaignHighlightMedium, viewLoader, campaignsView } from '../components';
import { setDefaultAccount, getDefaultAccount, getStoredCampaigns, setCampaign, getLocale, getContractEnvironment, txObject } from '../environment';
import { refreshPageButtons } from '../router';
import { download } from '../keystore';
import { t } from '../i18n';
import { web3 } from '../web3';
import { validCampaigns } from '../environment';

// require contracts
const contracts = new Contracts(getContractEnvironment(), web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();
const curationRegistry = contracts.CurationRegistry.instance();


function bignumberToSafeObject(value) {
  if (typeof value === 'object' && value !== null) {
    if (value.lessThanOrEqualTo) {
      return { val: value.toString(10), isBigNumber: true };
    } else if (!value.getMonth && !value.getYear) {
      if (Array.isArray(value)) {
        const outputValue = value.slice();
        outputValue.forEach((item, index) => {
          outputValue[index] = bignumberToSafeObject(outputValue[index]);
        });
        return outputValue;
      } else {
        const outputValue = Object.assign({}, value);
        Object.keys(outputValue).forEach(key => {
          outputValue[key] = bignumberToSafeObject(outputValue[key]);
        });
        return outputValue;
      }
    }
  }

  return value;
}

function safeObjectToBigNumber(value) {
  if (typeof value === 'object' && value !== null) {
    if (value.isBigNumber === true) {
      return new BigNumber(value.val);
    } else if (!value.getMonth && !value.getYear) {
      if (Array.isArray(value)) {
        const outputValue = value.slice();
        outputValue.forEach((item, index) => {
          outputValue[index] = safeObjectToBigNumber(outputValue[index]);
        });
        return outputValue;
      } else {
        const outputValue = Object.assign({}, value);
        Object.keys(outputValue).forEach(key => {
          outputValue[key] = safeObjectToBigNumber(outputValue[key]);
        });
        return outputValue;
      }
    }
  }

  return value;
}

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
export default function loadAndDrawCampaignsList() {
  // the campaign id selector array
  var selectorArray = [];

  // draw loader
  el('#view-list').innerHTML = '';
  el('#view-list').appendChild(campaignsView({ t }));

  // load snapshot
  if (getStoredCampaigns().length === 0) {
    const snapshotCampaigns = safeObjectToBigNumber(stateSnapshot);
    Object.keys(snapshotCampaigns).forEach(campaignID => {
      setCampaign(campaignID, snapshotCampaigns[campaignID]);

      // draw campaigns everytime
      drawCampaigns(getStoredCampaigns());
    });
  } else {
    drawCampaigns(getStoredCampaigns());
  }

  // get the number of campaigns then load campaigns list accordingly
  campaignRegistry.numCampaigns((numCampaignsError, numCampaignsResult) => {
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
      selector: validCampaigns(),
    }, (loadCampaignsError, loadCampaignsResult) => {

      // download snapshot
      // download('getCampaignsState.json', JSON.stringify(bignumberToSafeObject(loadCampaignsResult)));

      // handle errors
      if (loadCampaignsError) {
        el('#campaigns_list').innerHTML = '';
        el('#campaigns_list').appendChild(yo`<span>
          Error while loading campaigns ${JSON.stringify(loadCampaignsError)}
        </span>`);
        return;
      }

      // draw campaigns page
      el('#view-list').innerHTML = '';
      el('#view-list').appendChild(campaignsView({ t }));

      // if load result is nice
      if (typeof loadCampaignsResult === 'object') {
        Object.keys(loadCampaignsResult).forEach((campaignID) => {
          setCampaign(campaignID, loadCampaignsResult[campaignID]);
        });

        el('#campaigns_list').innerHTML = ``;

        // draw campaigns everytime
        drawCampaigns(getStoredCampaigns());
      }
    });
  });
}
