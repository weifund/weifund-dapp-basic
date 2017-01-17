import lightwallet from 'eth-lightwallet';

import { updateWalletUI } from './handleEncryptSeed';
import { el } from '../document';
import { setKeystore, setWalletProvider } from '../keystore';
import { getRouter } from '../router';


function changeWalletFile(event) {
  const campaignId = parseInt(el('#campaign_id').value);

  // Read the keystore JSON from the selected file.
  // NOTE: The keystore will use the first HD path with addresses it finds
  // in the file. eth-lightwallet defaults to m/0'/0'/0', which lightwallet.io
  // refers to as the "ConsenSys" HD path. For instance, wallets from the
  // SingularDTV token launch dapp use the ConsenSys HD path.
  // See also: https://github.com/ethereum/EIPs/issues/84
  const reader = new FileReader();
  const filePromise = new Promise(resolve => {
    reader.onload = (loadEvent) => {
      resolve(loadEvent.target.result);
    }
  });
  reader.readAsText(this.files[0]);

  filePromise
    .then(lightwallet.keystore.deserialize)
    .then(keystore => {
      setKeystore(keystore);
      setWalletProvider(keystore);
      return keystore;
    })
    .then(updateWalletUI)
    .then(() => {
      // Reset the file input.
      this.removeEventListener('change', changeWalletFile);
      this.value = '';

      // Navigate to the account display.
      getRouter()(`/campaign/${campaignId}/contribute/wallet/balance`);
    })
}

export default function handleOpenWalletFile(event) {
  event.preventDefault();

  const fileEl = el('#view-campaign-contribute-wallet-restore input[type=file]');

  // Add a change handler to the file input to read the file.
  fileEl.addEventListener('change', changeWalletFile);

  // Simulate a click on the file input to display a file chooser.
  fileEl.click();
}
