// require web3
const Web3 = require('web3');

// new web3 object
const web3 = new Web3();

// setup web3 provider
const setupWeb3Provider = function() {
  // window provider support (metamask)
  // set provider later
  if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    web3.setProvider(window.web3.currentProvider);
  } else {
    // set default provider to local 8545
    web3.setProvider(new web3.providers.HttpProvider('https://morden.infura.io/'));
  }
};

// export web3 instance and setup
module.exports = {
  web3: web3,
  setupWeb3Provider: setupWeb3Provider,
};
