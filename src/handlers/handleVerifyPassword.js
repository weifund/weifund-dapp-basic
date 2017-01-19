import { el } from '../document';


export default function handleVerifyPassword(event) {
  const formEl = el('#view-campaign-contribute-wallet-password form');
  const password1 = formEl.querySelector('input[name=password-1]');
  const password2 = formEl.querySelector('input[name=password-2]');
  const buttonEl = formEl.querySelector('input[type=submit]');
  if (password1.value === password2.value) {
    buttonEl.removeAttribute('disabled');
  } else {
    buttonEl.setAttribute('disabled', 'disabled');
  }
}
