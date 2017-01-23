import promisify from 'es6-promisify';
import lightwallet from 'eth-lightwallet';
import QRious from 'qrious';
import yo from 'yo-yo';

import { viewLoader } from '../components';
import { el } from '../document';
import { t } from '../i18n';
import { setDefaultAccount, setAccountBalance, getDefaultAccount, txObject } from '../environment';
import { createEncryptedKeystore, getSeed, setKeystore, setWalletProvider } from '../keystore';
import { getRouter } from '../router';
import { web3 } from '../web3';

let timeout;
let keepPolling = true;

/**
 * Create a function that updates the wallet UI depending on the account's balance.
 *
 * Returns a Promise that resolves to whether the user has a non-zero balance.
 */
export function contributionBalanceUpdater(address) {
  function updateContributionBalance() {
    const getBalance = promisify(web3.eth.getBalance);
    return getBalance(address)
      .then(balance => {
        const balanceEl = el('#view-campaign-contribute-wallet-balance .account-balance');
        const formBalanceEl = el('#defaultAccountBalance');
        const reviewBalanceEl = el('#campaign_reviewAccountBalance');
        const contributeAmountEl = el('#campaign_contributeAmount');
        const contributeSliderEl = el('#campaign_contributeSlider');
        const availableBalance = balance.minus(txObject().gas);
        const availableBalanceEther = web3.fromWei(availableBalance, 'ether');
        const balanceEther = web3.fromWei(balance, 'ether');

        if (balance.gt(0)) {
          clearTimeout(timeout);
          keepPolling = false;
        }

        // set the acocunt balance
        setAccountBalance(balance);

        // doing draws elswhere in campaignContribute.js

        // slider max
        contributeSliderEl.dataset.valueMax = availableBalanceEther.toString(10);
        contributeAmountEl.value = String(0.125);

        const contributeEl = el('#campaign-contribute-to-campaign');

        if (balance.gte(web3.toWei(1, 'finney'))) {
          contributeEl.innerHTML = 'Contribute';
          contributeEl.removeAttribute('disabled');
          return true;
        } else {
          contributeEl.innerHTML = 'Polling for balance...';
        }

        return false;
      })
      .catch((error) => {
        getRouter()(`/campaign/${campaignId}/contribute/wallet/restore`);
      });
  }

  return updateContributionBalance;
}

function startPollingForBalance(address) {
  // Keep polling until the contribute button is clicked.
  const contributeEl = el('#campaign-contribute-to-campaign');
  contributeEl.addEventListener('click', () => { keepPolling = false; });

  const updateBalance = contributionBalanceUpdater(address);
  function pollForBalance() {
    return updateBalance()
      .catch(() => false)
      .then(hasBalance => {
        if (!hasBalance && keepPolling) {
          timeout = setTimeout(pollForBalance, 10000);
        }
      });
  }
  return pollForBalance();
}

export function updateWalletUI() {
  el('#campaign-contribute-to-campaign').setAttribute('disabled', 'disabled');

  const getAccounts = promisify(web3.eth.getAccounts);
  getAccounts()
    .then(accounts => {
      const address = accounts[0];

      setDefaultAccount(address);

      el('#campaign-contribute-qrcode').style.display = 'block';
      new QRious({
        element: el('#campaign-contribute-qrcode'),
        size: 250,
        value: address,
      });

      // start polling
      return startPollingForBalance(address);
    })
    .catch((error) => {
      getRouter()(`/campaign/${campaignId}/contribute/wallet/restore`);
    });
}

export default function handleEncryptSeed(event) {
  event.preventDefault();
  // Browsers will notice the unsubmitted form and warn users about unsaved
  // changes when they try to navigate away. This disables that check.
  const formEl = el('#view-campaign-contribute-wallet-password form');
  const password1 = formEl.querySelector('input[name=password-1]');
  const password2 = formEl.querySelector('input[name=password-2]');

  if (password1.value !== password2.value || password1.value.length === 0) {
    // If the passwords don't match, abort. The submit button in the UI should
    // still be disabled.
    el('#encrypt-wallet-button').setAttribute('disabled', 'disabled');
    return;
  } else {
    el('#encrypt-wallet-button').removeAttribute('disabled');
  }

  const password = password1.value;
  formEl.reset();

  // Show loading spinner.
  const campaignId = parseInt(el('#campaign_id').value);
  el('#view-campaign-contribute').style.display = 'none';
  el('#view-focus').style.display = 'block';
  el('#view-focus').innerHTML = '';
  el('#view-focus').appendChild(viewLoader({ t }));

  getSeed()
    .then(seedPhrase => createEncryptedKeystore(seedPhrase, password))
    .then(keystore => {
      setKeystore(keystore);
      setWalletProvider(keystore);
      return keystore;
    })
    .then(updateWalletUI)
    .then(() => {
      // Navigate from the loading screen to the download screen.
      el('#campaign-contribute-wallet-error').style.display = 'none';
      getRouter()(`/campaign/${campaignId}/contribute/wallet/download`);
    })
    .catch((error) => {
      getRouter()(`/campaign/${campaignId}/contribute/wallet/restore`);
      el('#campaign-contribute-wallet-error').style.display = 'block';
      el('#campaign-contribute-wallet-error').innerHTML = '';
      el('#campaign-contribute-wallet-error').appendChild(yo`<span>
        <h3 style="margin-top: 0px;">Wallet Error</h3>
        <p>There was an error loading your wallet: ${String(error)}</p>
      </span>`);
    });
}
