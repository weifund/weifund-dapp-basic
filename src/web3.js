// require web3
import Web3 from 'web3';
import { getContractEnvironment } from './environment';

// new web3 object
export const web3 = new Web3(new Web3.providers.HttpProvider(`https://${getContractEnvironment()}.infura.io/`));

// set provider to default
export function setProviderToDefault() {
  web3.setProvider(new Web3.providers.HttpProvider(`https://${getContractEnvironment()}.infura.io/`));
}

// setup web3 provider
export function setupWeb3Provider() {
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
