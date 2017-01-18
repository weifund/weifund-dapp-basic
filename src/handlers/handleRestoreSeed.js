import { el } from '../document';
import { setSeed } from '../keystore';
import { getRouter } from '../router';


export default function handleRestoreSeed(event) {
  event.preventDefault();

  const seedEl = el('#view-campaign-contribute-wallet-restore input[type=text]');
  setSeed(seedEl.value);
  seedEl.value = '';
  const campaignId = parseInt(el('#campaign_id').value, 10);
  // Navigate to the encryption screen.
  getRouter()(`/campaign/${campaignId}/contribute/wallet/password`);
}
