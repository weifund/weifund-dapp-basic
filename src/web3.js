// require web3
import Web3 from 'web3';

// new web3 object
export const web3 = new Web3();

// set provider to default
export function setProviderToDefault() {
  web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));
}

// setup web3 provider
export function setupWeb3Provider() {
  // window provider support (metamask)
  // set provider later
  if (window.hasOwnProperty('web3') && typeof window.web3.currentProvider !== 'undefined') {
    // web3.setProvider(window.web3.currentProvider);
  } else {
    // set default provider to local 8545
    // web3.setProvider(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));
  }
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
