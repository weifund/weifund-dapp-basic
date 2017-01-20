import yo from 'yo-yo';

import { el } from '../document';
import modal from '../components/modal';

export default function handlePassword() {
  return new Promise((resolve, reject) => {
    el('#modal-wrapper').innerHTML = ''
    el('#modal-wrapper').appendChild(modal({
      title: 'Decrypt Wallet',
      actionTitle: 'Confirm',
      body: yo`<span>
        <h3 style="margin-top: 0px;">Password</h3>
        <p>Enter your password to decrypt your lightwallet.</p>
        <input type="password"
        class="form-control"
        id="model-password"
        placeholder="Passphrase" />
      </span>`,
      onAction: (e) => {
        const passphrase = el('#model-password').value;
        resolve(passphrase);
        el('#model-password').value = '';
      },
      onClose: (e) =>{
        reject('Decryption request canceled.');
      }
    }));
    el('#model-password').focus();
  });
}
