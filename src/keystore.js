import lightwallet from 'eth-lightwallet';
import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';
import Web3Subprovider from 'web3-provider-engine/subproviders/web3';

import { web3 } from './web3';

// We disable passwords in eth-lightwallet since we do not store keys on disk.
// The key is immediately used to fund the campaign, and there's no gain from
// encrypting the keys from when they're entered to when they're used. Keys
// remain accessible until the browser window is closed.
// TODO: Reset the web3 provider after a timeout and after contributions are
//       made.
const PASSWORD = 'Disable passwords.';
const SALT = 'salt';
// Allow keystore to be unlocked without prompting for a password.
const passwordProvider = function (cb) { cb(null, password); };


export function createUnlockedKeystore(seedPhrase) {
  return new Promise((resolve, reject) => {
    lightwallet.keystore.createVault({
      seedPhrase,
      password: PASSWORD,
      salt: SALT,
      hdPathString: "m/44'/60'/0'/0",
    }, (err, keystore) => {
      if (err) reject(err);
      resolve(keystore);
    });
  });
}

export function deriveKeyForUnlockedKeystore() {
  return new Promise((resolve, reject) => {
    lightwallet.keystore.deriveKeyFromPassword(PASSWORD, SALT, (err, passwordKey) => {
      if (err != null) reject(err);
      resolve(passwordKey);
    });
  });
}

export function setWalletProvider(keystore) {
  return new Promise((resolve) => {
    keystore.keyFromPassword(PASSWORD, function (err, pwDerivedKey) {
      keystore.generateNewAddress(pwDerivedKey, 1);
      keystore.passwordProvider = passwordProvider;

      // Create a provider engine that uses the keystore to sign transactions.
      const provider = new ProviderEngine();
      provider.addProvider(new HookedWalletSubprovider({
        getAccounts(callback) {
          callback(null, keystore.getAddresses());
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
      resolve(provider);
    });
  });
}

// Manage a global reference to the current keystore so the seed can be fetched
// when needed. It's easy for this keystore to accidentally get out of sync
// with the current web3 provider.
// TODO: Use an immutable store like redux to manage the a single source
// of truth for the keystore.
export let keystore = null;

export function setKeystore(newKeystore) {
  keystore = newKeystore;
}

export function getSeed() {
  if (keystore == null) {
    return Promise.reject(new Error("The keystore hasn't been set, so you can't get the seed."));
  }

  return deriveKeyForUnlockedKeystore().then(pwKey => keystore.getSeed(pwKey));
}
