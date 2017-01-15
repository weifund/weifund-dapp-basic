import promisify from 'es6-promisify';
import lightwallet from 'eth-lightwallet';
import QRious from 'qrious';
import yo from 'yo-yo';

import { viewLoader } from '../components';
import { el } from '../document';
import { t } from '../i18n';
import { setDefaultAccount } from '../environment';
import { createEncryptedKeystore, getSeed, setKeystore, setWalletProvider } from '../keystore';
import { getRouter } from '../router';
import { web3 } from '../web3';

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
        const balanceEther = web3.fromWei(balance, 'ether');

        balanceEl.innerHTML = '';
        balanceEl.appendChild(yo`<span>${balanceEther.toString(10) || '0'}</span>`);

        formBalanceEl.innerHTML = '';
        formBalanceEl.appendChild(yo`<span>${balanceEther.toString(10) || '0'}</span>`);

        if (balance.gte(web3.toWei(1, 'ether'))) {
          const contributeEl = el('#view-campaign-contribute-wallet-balance a.contribute');
          contributeEl.removeAttribute('disabled');
          return true;
        }
        return false;
      });
  }

  return updateContributionBalance;
}

function startPollingForBalance(address) {
  // Keep polling until the contribute button is clicked.
  let keepPolling = true;
  const contributeEl = el('#view-campaign-contribute-wallet-balance a.contribute');
  contributeEl.addEventListener('click', () => { keepPolling = false; });

  const updateBalance = contributionBalanceUpdater(address);
  function pollForBalance() {
    return updateBalance()
      .catch(() => false)
      .then(hasBalance => {
        if (!hasBalance && keepPolling) {
          setTimeout(pollForBalance, 10000);
        }
      });
  }
  return pollForBalance();
}

export function updateWalletUI() {
  const getAccounts = promisify(web3.eth.getAccounts);
  getAccounts()
    .then(accounts => {
      const address = `0x${accounts[0]}`;
      const addressEl = el('#view-campaign-contribute-wallet-balance .user-address');
      addressEl.innerHTML = '';
      addressEl.appendChild(yo`<span>${address}</span>`);
      const defaultAddressEl = el('#defaultAccountAddress');
      defaultAddressEl.innerHTML = '';
      defaultAddressEl.appendChild(yo`<span>${address}</span>`);
      setDefaultAccount(address);

      new QRious({
        element: el('#campaign-contribute-qrcode'),
        size: 250,
        value: address,
      });

      return startPollingForBalance(address);
    });
}

export default function handleEncryptSeed(event) {
  event.preventDefault();
  // Browsers will notice the unsubmitted form and warn users about unsaved
  // changes when they try to navigate away. This disables that check.
  window.onbeforeunload = null;

  const formEl = el('#view-campaign-contribute-wallet-password form');
  const password1 = formEl.querySelector('input[name=password-1]');
  const password2 = formEl.querySelector('input[name=password-2]');
  if (password1.value !== password2.value) {
    // If the passwords don't match, abort. The submit button in the UI should
    // still be disabled.
    return;
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
      // Navigate from the loading screen to the account display.
      getRouter()(`/campaign/${campaignId}/contribute/wallet/balance`);
    })
}
