import { footer, navBar, modal } from '../components';
import { el } from '../document';
import { t } from '../i18n';
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getLocale, getContractEnvironment, txObject } from '../environment';
import buildAllNavToggles from './drawAllNavToggles';
import buildAllInputSliders from './drawAllInputSliders';

// export
function buildLocaleToggles() {
  [].slice.call(document.querySelectorAll('.input-locale-toggle')).forEach((inputToggleElement) => {
    // check if toggle is listening
    if (inputToggleElement.dataset.listening) {
      return;
    }

    // add supported locales
    inputToggleElement.appendChild(yo`
      <option>Locale</option>
      <option value="en">en</option>
      <option value="zh">zh</option>
    `);

    // input is now listening
    inputToggleElement.dataset.listening = true;

    // add toggle event listener
    inputToggleElement.addEventListener('change', (localeToggleEvent) => {
      // input toggle value
      const inputToggleValue = inputToggleElement.value;

      // set the locale
      setLocale(inputToggleValue);

      // localtion reload
      location.reload();
    });
  });
}

function drawModal() {
  el('#modal-wrapper').innerHTML = '';
  el('#modal-wrapper').appendChild(modal({ t }));
}

function drawFooter() {
  el('#footer-wrapper').innerHTML = '';
  el('#footer-wrapper').appendChild(footer({ t }));
  buildLocaleToggles();
}

function drawNavBar() {
  el('#nav-wrapper').innerHTML = '';
  el('#nav-wrapper').appendChild(navBar({ t }));
  buildAllNavToggles();
  buildLocaleToggles();
}

// module exports
module.exports = {
  drawNavBar,
  drawFooter,
  drawModal,

  loadAndDrawCampaign: require('./loadAndDrawCampaign').default,
  loadAndDrawCampaignContribute: require('./loadAndDrawCampaignContribute').default,
  loadAndDrawCampaignsList: require('./loadAndDrawCampaignsList').default,
  loadAndDrawAccount: require('./loadAndDrawAccount').default,
  handleConfirmOnPageExit: require('./handleConfirmOnPageExit').default,

  handleCampaignContribution: require('./handleCampaignContribution').default,
};
