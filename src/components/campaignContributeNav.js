import yo from 'yo-yo';

import { el } from '../document';
import { logout } from '../keystore';


/**
 * Clear any state derived from a user's lightwallet.
 *
 * FIXME: Derived state is hard to manage. The keystore itself belongs in a
 * global store like redux, and we should use a provider that always respects
 * the state in the store so clearing it once clears it everywhere. The inputs
 * and seed elements should manage their state within components that get
 * cleared automatically when they're removed from the DOM and disposed of.
 */
function resetWalletData() {
  logout();

  const sensitiveInputs = [
    el('#view-campaign-contribute-wallet-password input[name=password-1]'),
    el('#view-campaign-contribute-wallet-password input[name=password-2]'),
    el('#view-campaign-contribute-wallet-confirm input[type=text]'),
  ];
  sensitiveInputs.forEach(input => { input.value = '' });

  const sensistiveElements = [
    el('#view-campaign-contribute-wallet-seed .seed'),
  ];
  sensistiveElements.forEach(element => { element.innerHTML = '...'; });
}

// main export
export default function campaignContributeNav(options) {
  const t = options.t;

  return yo`<div>
  <div class="row">
    <div class="col-xs-12">
      <hr />
    </div>
  </div>
  <div class="row">
    <div class="col-xs-6 text-left">
      ${options.showBackButton === false
        && ``
        || yo`<a href=${options.backURL} onclick=${resetWalletData} class="btn btn-primary btn-back">BACK</a>`}
    </div>
    <div class="col-xs-6 text-right">
    </div>
  </div>
</div>`;
}
