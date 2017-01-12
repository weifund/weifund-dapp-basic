import lightwallet from 'eth-lightwallet';
import QRious from 'qrious';
import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import Web3Subprovider from 'web3-provider-engine/subproviders/web3';

import { el } from '../document';
import { createUnlockedKeystore, getSeed, setKeystore, setWalletProvider } from '../keystore';
import { getRouter } from '../router';
import { web3 } from '../web3';


function updateWalletUI() {
  // Update the account address and QR code.
  web3.eth.getAccounts((err, accounts) => {
    if (err || accounts.length < 1) {
      console.error(`Lightwallet accounts failed to load: ${err}/${accounts}`);
      return;
    }
    const address = `0x${accounts[0]}`;
    const addressEl = el('#view-campaign-contribute-wallet-balance .user-address');
    addressEl.innerHTML = address;

    new QRious({
      element: el('#campaign-contribute-qrcode'),
      size: 250,
      value: address,
    });

    // Update the balance.
    web3.eth.getBalance(address, (err, balance) => {
      if (err) {
        console.error(`Lightwallet balance failed to load: ${err}`);
        return;
      }

      const balanceEl = el('#view-campaign-contribute-wallet-balance .account-balance');
      balanceEl.innerHTML = web3.fromWei(balance, 'ether');
    });
  });
}

/**
 * Wraps eth-lightwallet's generateRandomSeed to collect extra entropy.
 *
 * Collect some mouse positions to seed the random number generator. This
 * will not save you from a flawed random number generator, but it's
 * better than nothing.
 */
function generateSeedWithEntropy() {
  return new Promise((resolve) => {
    const entropy = [];
    const samplesToCollect = 40;
    const sampleDelayMs = 300;
    const eventEl = el('body');
    let lastPosition = [0, 0];

    function collectMouseEntropy(event) {
      if (lastPosition[0] == event.screenX && lastPosition[1] == event.screenY) {
        return;
      }

      if (lastPosition[0] != 0 && lastPosition[1] != 0) {
        // Collect entropy after the first mouse movement has initialized
        // lastPosition.
        entropy.push(String.fromCharCode(event.screenX % 256));
        entropy.push(String.fromCharCode(event.screenY % 256));
      }

      lastPosition = [event.screenX, event.screenY];

      // Update the progress bar.
      const progress = entropy.length / samplesToCollect * 100;
      el('#view-campaign-contribute-wallet-entropy .progress').style.width = `${progress}%`;

      // Remove the event listener. If we haven't finished collecting entropy,
      // the listener will be added again after a delay for the mouse to move
      // away.
      eventEl.removeEventListener('mousemove', collectMouseEntropy);

      if (entropy.length >= samplesToCollect) {
        const entropyString = entropy.join('');
        resolve(lightwallet.keystore.generateRandomSeed(entropyString));
        return;
      }

      // Let enough time elapse for the mouse to move away, then add an listener
      // for the next move event.
      setTimeout(
        () => eventEl.addEventListener('mousemove', collectMouseEntropy),
        sampleDelayMs);
    }

    eventEl.addEventListener('mousemove', collectMouseEntropy);
  });
}

/**
 * Use the provided entropy to generate a seed, update the web3 provider,
 * and update the UI.
 */
export default function handleGenerateWallet(event) {
  generateSeedWithEntropy()
    .then(seedPhrase => {
      // Display the new seed in the UI.
      const seedEl = el('#view-campaign-contribute-wallet-password .seed');
      seedEl.innerHTML = seedPhrase;

      // Navigate from the entropy collection screen to the seed display.
      const campaignId = parseInt(el('#campaign_id').value);
      getRouter()(`/campaign/${campaignId}/contribute/wallet/password`);

      // Create a keystore with the new seed.
      return createUnlockedKeystore(seedPhrase);
    })
    .then(keystore => {
      setKeystore(keystore);
      return setWalletProvider(keystore);
    })
    .then(updateWalletUI);
}
