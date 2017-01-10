// require ipfs from vendor
import ipfs from 'ipfs-js';

// setup ipfs provider
function setupIPFSProvider() {
  // set ipfs provider
  ipfs.setProvider({host: 'ipfs.infura.io', port: '5001', protocol: 'https'});
}

// ipfs instance
module.exports = {
  ipfs,
  setupIPFSProvider,
};
