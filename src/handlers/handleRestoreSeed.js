import { updateWalletUI } from './handleGenerateWallet';
import { viewLoader } from '../components';
import { el } from '../document';
import { t } from '../i18n';
import { createUnlockedKeystore, getSeed, setKeystore, setWalletProvider } from '../keystore';
import { getRouter } from '../router';


export default function handleRestoreSeed(event) {
  event.preventDefault();

  const seedEl = el('#view-campaign-contribute-wallet-restore input[type=text]');
  const seedPhrase = seedEl.value;
  const campaignId = parseInt(el('#campaign_id').value);

  // Show loading spinner.
  el('#view-campaign-contribute').style.display = 'none';
  el('#view-focus').style.display = 'block';
  el('#view-focus').innerHTML = '';
  el('#view-focus').appendChild(viewLoader({ t }));

  createUnlockedKeystore(seedPhrase)
    .then(keystore => {
      setKeystore(keystore);
      return setWalletProvider(keystore);
    })
    .then(updateWalletUI)
    .then(() => {
      // Navigate from the loading screen to the account display.
      getRouter()(`/campaign/${campaignId}/contribute/wallet/balance`);
    });
}
