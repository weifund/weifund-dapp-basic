import promisify from 'es6-promisify';
import lightwallet from 'eth-lightwallet';
import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import Web3Subprovider from 'web3-provider-engine/subproviders/web3';

import { web3 } from './web3';

// The seed for the contribution flow is stored here. It's only the canonical
// source for the seed when there's no provider yet.
// FIXME: Global mutable state is painful to reason about. Use React
// components instead.
export let seed = null;

// Manage a global reference to the current keystore so the seed can be fetched
// when needed. It's easy for this keystore to accidentally get out of sync
// with the current web3 provider.
// TODO: Use an immutable store like redux to manage the a single source
// of truth for the keystore.
export let keystore = null;


export function inputPassword() {
  // FIXME: window.prompt has a cleartext input box. We need to build our own
  // prompt with a real password input.
  const password = window.prompt('Enter your password to decrypt your lightwallet.');
  return Promise.resolve(password);
}

export function ensureKeystoreHasAddress(keystore, password) {
  const keyFromPassword = promisify(keystore.keyFromPassword.bind(keystore));
  return keyFromPassword(password)
    .then(passwordKey => {
      keystore.generateNewAddress(passwordKey, 1);
      return keystore;
    });
}

export function createEncryptedKeystore(seedPhrase, password) {
  const createVault = promisify(lightwallet.keystore.createVault.bind(lightwallet.keystore));
  return createVault({
    seedPhrase,
    password,
    hdPathString: "m/44'/60'/0'/0",
  })
    .then(keystore => ensureKeystoreHasAddress(keystore, password))
    .then(keystore => {
      keystore.passwordProvider = (cb) => inputPassword().then((pw) => cb(null, pw));
      return keystore;
    });
}

/**
 * Create and activate a ProviderEngine that signs transactions with the keystore.
 * @param {[type]} keystore [description]
 */
export function setWalletProvider(keystore) {
  const provider = new ProviderEngine();
  provider.addProvider(new HookedWalletSubprovider({
    getAccounts(callback) {
      callback(null, [`0x${keystore.getAddresses()[0]}`]);
    },
    signTransaction: keystore.signTransaction.bind(keystore),
  }));
  const web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/');
  provider.addProvider(new Web3Subprovider(web3Provider));

  // Activate the provider, but stop polling for blocks since we don't use
  // filter RPC calls.
  provider.start();
  provider.stop();

  web3.setProvider(provider);
}

export function setKeystore(newKeystore) {
  keystore = newKeystore;
  seed = null;
}

export function setSeed(newSeed) {
  seed = newSeed;
  keystore = null;
}

/**
 * Get the current seed both during the lightwallet creation process and afterwards.
 */
export function getSeed() {
  if (keystore == null && seed == null) {
    return Promise.reject(new Error('Neither the keystore nor the plaintext seed have been set yet.'));
  }

  if (keystore != null) {
    const keyFromPassword = promisify(keystore.keyFromPassword.bind(keystore));
    return inputPassword()
      .then(keyFromPassword)
      .then(pwKey => keystore.getSeed(pwKey));
  }

  return Promise.resolve(seed);
}

function download(filename, text) {
  const trigger = document.createElement('a');
  trigger.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  trigger.setAttribute('download', filename);
  trigger.click();
}

export function saveWalletFile() {
  if (keystore == null) {
    throw new Error('Keystore is null while attempting to save the wallet.');
  }

  const walletString = keystore.serialize();
  download('weifund-wallet.json', walletString);
}
