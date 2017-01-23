// require web3
import Web3 from 'web3';
import { getContractEnvironment, setDefaultAccount, setAccountBalance } from './environment';

// new web3 object
export const web3 = new Web3(new Web3.providers.HttpProvider(`https://${getContractEnvironment()}.infura.io/`));

// set provider to default
export function setProviderToDefault() {
  web3.setProvider(new Web3.providers.HttpProvider(`https://${getContractEnvironment()}.infura.io/`));
}

// setup web3 provider
export function setupWeb3Provider() {
}

export function setMetamaskProvider(cb) {
  return new Promise((resolve, reject) => {
    if (typeof window.web3 !== 'undefined' &&
      typeof window.web3.currentProvider !== 'undefined') {
      web3.setProvider(window.web3.currentProvider);

      web3.version.getNetwork((networkError, network) => {
        if (networkError) {
          return reject(networkError, null);
        }

        if (network !== '1') {
          return reject('Invalid network selected, must be on Ethereum mainnet.', null);
        }

        web3.eth.getAccounts((accountError, accounts) => {
          if (accountError) {
            return reject(accountError, null);
          }

          web3.eth.getBalance(accounts[0], (balanceError, balance) => {
            if (balanceError) {
              return reject(balanceError, null);
            }

            setDefaultAccount(accounts[0]);
            setAccountBalance(balance);

            resolve({ account: accounts[0], balance });
          });
        });
      });
    } else {
      reject('No injected web3 provider found.', null);
    }
  });
}

export function getTransactionSuccess(txHash, callback) {
  const cb = callback || function cb() {};
  return new Promise((resolve, reject) => {
    const txInterval = setInterval(() => {
      web3.eth.getTransactionReceipt(txHash, (err, result) => {
        if (err) {
          clearInterval(txInterval);
          cb(err, null);
          reject(err);
        }

        if (!err && result && result !== null) {
          clearInterval(txInterval);
          cb(null, result);
          resolve(result);
        }
      });
    }, 2000);
  });
}

// set provider to default
setProviderToDefault();
