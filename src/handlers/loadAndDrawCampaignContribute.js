import { getCampaigns } from 'weifund-lib';
import yo from 'yo-yo';
import Contracts from 'weifund-contracts';
import BigNumber from 'bignumber.js';

import { log, etherScanAddressUrl, parseSolidityMethodName,
  parseSolidityMethodInterface, etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';
import { el } from '../document';
import { campaignContributeView, viewLoader } from '../components';
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign, getAccountBalance,
  getNetwork, getLocale, getContractEnvironment, txObject, setAccountBalance, setTokenPrice } from '../environment';
import { web3, setMetamaskProvider } from '../web3';
import { ipfs } from '../ipfs';
import { getRouter, refreshPageButtons } from '../router';
import { t } from '../i18n';
import handleCampaignContribution from './handleCampaignContribution';
import handleEncryptSeed from './handleEncryptSeed';
import handleGenerateWallet from './handleGenerateWallet';
import handleRestoreSeed from './handleRestoreSeed';
import handleSaveWalletFile from './handleSaveWalletFile';
import handleOpenWalletFile from './handleOpenWalletFile';
import handleVerifyPassword from './handleVerifyPassword';
import handleVerifySeed from './handleVerifySeed';
import buildAllInputSliders from './drawAllInputSliders';
import handleConfirmOnPageExit from './handleConfirmOnPageExit';
import handleCampaignContributeReview from './handleCampaignContributeReview';
let attemptingContribution = false;


const contracts = new Contracts(getContractEnvironment(), web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();

// load and draw campaign contribute page/flow
export default function loadAndDrawCampaignContribute(campaignID, callback) {
  // window warnign message
  window.onunload = window.onbeforeunload = handleConfirmOnPageExit;

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
      t,
      defaultAccount: getDefaultAccount,
      getNetwork: getNetwork,
    }));

    // contribution error
    // handleCampaignContributeReview(campaignData);

    // weifund amount contributor amount
    el('#campaign_contributeAmount').addEventListener('change', e => handleCampaignContributeReview(campaignData));

    // update form when disclaimer is checked
    el('#campaign-contribute-disclaimer').addEventListener('change', e => handleCampaignContributeReview(campaignData));

    // contirbute to campaign buton
    el('#campaign-contribute-to-campaign').addEventListener('click', () => {
      // check balance
      if (getAccountBalance().gte(web3.toWei('1', 'finney'))) {
        getRouter()(`/campaign/${campaignID}/contribute/form`);
        history.pushState({}, null, `/campaign/${campaignID}/contribute/form`);
      }
    });

    // handleCampaignContribution
    el('#campaign-contribute-review-button').addEventListener('click', () => {
      attemptingContribution = false;
      if(handleCampaignContributeReview(campaignData)) {
        getRouter()(`/campaign/${campaignID}/contribute/review`);
        history.pushState({}, null, `/campaign/${campaignID}/contribute/review`);
        // el('#campaign-review-contribute-button').focus();
      }
    });

    const enhancer = contracts.Model1Enhancer.factory.at(campaignData.enhancer);
    const pollTokenPrice = () => {
      enhancer.price((err, result) => {
        if (!err && result) {
          const etherValue = new BigNumber('0.2'); // web3.fromWei(result, 'ether');

          el('#contribute-token-price').innerHTML = '';
          el('#contribute-token-price').appendChild(yo`<span>${etherValue.toString(10)}</span>`);
          el('#campaign_contributeAmount').value = etherValue.toString(10);

          setTokenPrice(etherValue);
        }
      });
    };

    setInterval(pollTokenPrice, 5000);
    pollTokenPrice();

    // set itnerval steps
    setInterval(() => {
      // adding balance polling here
      const balanceEl = el('#view-campaign-contribute-wallet-balance .account-balance');
      const formBalanceEl = el('#defaultAccountBalance');
      const reviewBalanceEl = el('#campaign_reviewAccountBalance');
      const contributeAmountEl = el('#campaign_contributeAmount');
      const contributeSliderEl = el('#campaign_contributeSlider');
      const balance = getAccountBalance();
      const availableBalance = balance.minus(txObject().gas);
      const availableBalanceEther = web3.fromWei(availableBalance, 'ether');
      const balanceEther = web3.fromWei(balance, 'ether');

      // set the acocunt balance
      setAccountBalance(balance);

      const addressEl = el('#view-campaign-contribute-wallet-balance .user-address');
      const reviewAddressEl = el('#campaign_reviewAccountAddress');
      const defaultAddressEl = el('#defaultAccountAddress');

      if (addressEl) {
        addressEl.innerHTML = '';
        addressEl.appendChild(yo`<span>${getDefaultAccount()}</span>`);
      }

      if (defaultAddressEl) {
        defaultAddressEl.innerHTML = '';
        defaultAddressEl.appendChild(yo`<span>${getDefaultAccount()}</span>`);
      }

      if (reviewAddressEl) {
        reviewAddressEl.innerHTML = '';
        reviewAddressEl.appendChild(yo`<span>${getDefaultAccount()}</span>`);
      }

      if (balanceEl) {
        balanceEl.innerHTML = '';
        balanceEl.appendChild(yo`<span>${balanceEther.toString(10) || '0'}</span>`);
      }

      // slider max
      contributeSliderEl.dataset.valueMax = availableBalanceEther.toString(10);
      formBalanceEl.innerHTML = '';

      formBalanceEl.appendChild(yo`<span>${balanceEther.toString(10) || '0'}</span>`);

      reviewBalanceEl.innerHTML = '';
      reviewBalanceEl.appendChild(yo`<span>${balanceEther.toString(10) || '0'}</span>`);

      let currentStep = 0;
      const currentPath = window.location.pathname;

      if (currentPath.indexOf('/form') !== -1) {
        currentStep = 1;
      }

      if (currentPath.indexOf('/review') !== -1) {
        currentStep = 2;
      }

      if (currentPath.indexOf('/receipt') !== -1) {
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
    el('#campaign-review-contribute-button').addEventListener('click', (e) => {
      if (attemptingContribution === false) {
        attemptingContribution = true;
        handleCampaignContribution(e);
      }
    });

    el('#campaign-wallet-metamask').addEventListener('click', (e) => {
      setMetamaskProvider()
      .then(result => {
        getRouter()(`/campaign/${campaignID}/contribute/form`);
        history.pushState({}, null, `/campaign/${campaignID}/contribute/form`);
      })
      .catch(err => {
        el('#campaign-contribute-wallet-response').style.display = 'block';
        el('#campaign-contribute-wallet-response').innerHTML = '';
        el('#campaign-contribute-wallet-response').appendChild(yo`<span>
          <h3 style="margin-top: 0px">MetaMask Provider Error</h3>
          <p>There was an error while using metamask:</p>
          <p>${String(err)}</p>
          <hr />
          <p>Please make sure you have MetaMask enabled, and set to "Main Etheruem Network"</p>
        </span>`);
      });
    });

    // wallet and password generation
    el('#view-campaign-contribute-wallet-restore a.open-file').addEventListener('click', handleOpenWalletFile);
    el('#view-campaign-contribute-wallet a.generate').addEventListener('click', handleGenerateWallet);
    el('#view-campaign-contribute-wallet-restore a.restore').addEventListener('click', (e) => {
      // test for valid seed
      if (el('#view-campaign-contribute-wallet-restore input[type=text]').value !== '') {
        handleRestoreSeed(e);
      }
    });
    el('#view-campaign-contribute-wallet-confirm input[type=text]').addEventListener('keyup', handleVerifySeed);
    el('#view-campaign-contribute-wallet-password input[name=password-1]').addEventListener('keyup', handleVerifyPassword);
    el('#view-campaign-contribute-wallet-password input[name=password-2]').addEventListener('keyup', handleVerifyPassword);
    el('#view-campaign-contribute-wallet-password form').addEventListener('submit', handleEncryptSeed);
    el('#view-campaign-contribute-wallet-download a.download').addEventListener('click', handleSaveWalletFile);
    el('#view-campaign-contribute-wallet-confirm a.confirm').addEventListener('click', e => {
      if (!el('#wallet-seed-confirm').hasAttribute('disabled')) {
        el('#view-campaign-contribute-wallet-confirm input[type=text]').value = '';
        getRouter()(`/campaign/${campaignID}/contribute/wallet/password`);
        history.pushState({}, null, `/campaign/${campaignID}/contribute/wallet/password`);
      }
    });

    // refresh all page buttons after redraw
    refreshPageButtons();

    // fire handler callback
    callback(null, true);

    // build all sliders
    buildAllInputSliders();
  });
}
