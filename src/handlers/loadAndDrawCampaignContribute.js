import { getCampaigns } from 'weifund-lib';
import Contracts from 'weifund-contracts';

import { log, etherScanAddressUrl, parseSolidityMethodName,
  parseSolidityMethodInterface, etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';
import { el } from '../document';
import { campaignContributeView, viewLoader } from '../components';
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';
import { web3 } from '../web3';
import { ipfs } from '../ipfs';
import { getRouter, refreshPageButtons } from '../router';
import { t } from '../i18n';
import handleCampaignContribution from './handleCampaignContribution';
import handleEncryptSeed from './handleEncryptSeed';
import handleGenerateWallet from './handleGenerateWallet';
import handleRestoreSeed from './handleRestoreSeed';
import handleSaveWalletFile from './handleSaveWalletFile';
import handleVerifyPassword from './handleVerifyPassword';
import handleVerifySeed from './handleVerifySeed';
import buildAllInputSliders from './drawAllInputSliders';
import handleConfirmOnPageExit from './handleConfirmOnPageExit';
import handleCampaignContributeReview from './handleCampaignContributeReview';


const contracts = new Contracts('ropsten', web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();

// load and draw campaign contribute page/flow
export default function loadAndDrawCampaignContribute(campaignID, callback) {
  // handle empty callback
  if (typeof callback !== 'function') {
    callback = (e, r) => {};
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
  }, (campaignLoadError, campaignDataObject) => {
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
      getRouter,
      web3,
      defaultAccount: getDefaultAccount,
      getNetwork: getNetwork,
    }));

    // weifund amount contributor amount
    el('#campaign_contributeAmount').addEventListener('change', handleCampaignContributeReview);

    // update form when disclaimer is checked
    el('#campaign-contribute-disclaimer').addEventListener('change', handleCampaignContributeReview);

    // handleCampaignContribution
    el('#campaign-contribute-review-button').addEventListener('click', () => {
      if(handleCampaignContributeReview()) {
        getRouter()(`/campaign/${campaignID}/contribute/review`);
        history.pushState({}, null, `/campaign/${campaignID}/contribute/review`);
      }
    });

    // set itnerval steps
    setInterval(() => {
      let currentStep = 0;
      const currentPath = window.location.pathname;

      if (currentPath.indexOf('/form') !== -1) {
        currentStep = 1;
      }

      if (currentPath.indexOf('/review') !== -1) {
        currentStep = 2;
      }

      if (currentPath.indexOf('/reciept') !== -1) {
        currentStep = 3;
      }

      if (el('#contributeStep0')) {
        el('#contributeStep0').className = `col-xs-4 col-sm-3 bs-wizard-step
          ${currentStep >= 0 && 'complete' || 'disabled'}
          ${currentStep === 0 && 'current' || ''}`;
        el('#contributeStep1').className = `col-xs-3 col-sm-3 bs-wizard-step
          ${currentStep >= 1 && 'complete' || 'disabled'}
          ${currentStep === 1 && 'current' || ''}`;
        el('#contributeStep2').className = `col-xs-3 col-sm-3 bs-wizard-step
          ${currentStep >= 2 && 'complete' || 'disabled'}
          ${currentStep === 2 && 'current' || ''}`;
        el('#contributeStep3').className = `col-xs-2 col-sm-3 bs-wizard-step
          ${currentStep >= 3 && 'complete' || 'disabled'}
          ${currentStep === 3 && 'current' || ''}`;
      }
    }, 300);

    // final contribution button
    el('#campaign-review-contribute-button').addEventListener('click', handleCampaignContribution);

    // wallet and password generation
    el('#view-campaign-contribute-wallet a.generate').addEventListener('click', handleGenerateWallet);
    el('#view-campaign-contribute-wallet-restore a.restore').addEventListener('click', handleRestoreSeed);
    el('#view-campaign-contribute-wallet-confirm input[type=text]').addEventListener('keyup', handleVerifySeed);
    el('#view-campaign-contribute-wallet-password input[name=password-1]').addEventListener('keyup', handleVerifyPassword);
    el('#view-campaign-contribute-wallet-password input[name=password-2]').addEventListener('keyup', handleVerifyPassword);
    el('#view-campaign-contribute-wallet-password form').addEventListener('submit', handleEncryptSeed);
    el('#view-campaign-contribute-wallet-download a.download').addEventListener('click', handleSaveWalletFile);

    // refresh all page buttons after redraw
    refreshPageButtons();

    // fire handler callback
    callback(null, true);

    // build all sliders
    buildAllInputSliders();
  });
}
