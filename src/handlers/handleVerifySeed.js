import { el } from '../document';
import { getSeed } from '../keystore';


export default function handleVerifySeed(event) {
  getSeed()
    .then(seed => {
      if (seed.toLowerCase() == event.target.value.toLowerCase()) {
        const confirmButton = el('#view-campaign-contribute-wallet-confirm a.confirm');
        confirmButton.removeAttribute('disabled');

        // Remove the seed from the DOM.
        const seedDisplayEl = el('#view-campaign-contribute-wallet-seed .seed');
        seedDisplayEl.innerHTML = '...';

        // When the user confirms the seed, clear the input box.
        const seedInputEl = event.target;
        confirmButton.addEventListener('click', () => {
          seedInputEl.value = '';
        });
      }
    });
}
