import lightwallet from 'eth-lightwallet';

import { el } from '../document';
import { saveWalletFile } from '../keystore';
import { getRouter } from '../router';


export default function handleSaveWalletFile(event) {
  event.preventDefault();

  saveWalletFile();

  const campaignId = parseInt(el('#campaign_id').value);
  // Navigate to the account screen.
  getRouter()(`/campaign/${campaignId}/contribute/wallet/balance`);
}
