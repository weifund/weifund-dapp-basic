import { el } from '../document';
import { getSeed } from '../keystore';


export default function handleVerifySeed(event) {
  getSeed()
    .then(seed => {
      if (seed.toLowerCase() == event.target.value.toLowerCase()) {
        const confirmButton = el('#view-campaign-contribute-wallet-confirm a.confirm');
        confirmButton.removeAttribute('disabled');
        // Remove the seed from the DOM.
        const seedEl = el('#view-campaign-contribute-wallet-seed .seed');
        seedEl.innerHTML = '...';
      }
    });
}
