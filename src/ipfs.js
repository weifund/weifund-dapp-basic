// require ipfs from vendor
const ipfs = require('../vendor/ipfs.min.js');

// setup ipfs provider
const setupIPFSProvider = function() {
  // set ipfs provider
  ipfs.setProvider({host: 'ipfs.infura.io', port: '5001', protocol: 'https'});
};

// ipfs instance
module.exports = {
  ipfs: ipfs,
  setupIPFSProvider: setupIPFSProvider,
};
