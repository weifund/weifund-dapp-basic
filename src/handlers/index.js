// require components
import { footer, navBar } from '../components';

// document helper
import { el } from '../document';
import { t } from '../i18n';

// environment
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';

import buildAllNavToggles from './drawAllNavToggles';
import buildAllInputSliders from './drawAllInputSliders';

// export
function buildLocaleToggles() {
  [].slice.call(document.querySelectorAll('.input-locale-toggle')).forEach(function(inputToggleElement){
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
    inputToggleElement.addEventListener('change', function(localeToggleEvent){
      // input toggle value
      const inputToggleValue = inputToggleElement.value;

      // set the locale
      setLocale(inputToggleValue);

      // localtion reload
      location.reload();
    });
  });
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

  loadAndDrawCampaign: require('./loadAndDrawCampaign'),
  loadAndDrawCampaignRefund: require('./loadAndDrawCampaignRefund'),
  loadAndDrawCampaignContribute: require('./loadAndDrawCampaignContribute'),
  loadAndDrawCampaignsList: require('./loadAndDrawCampaignsList'),
  loadAndDrawAccount: require('./loadAndDrawAccount'),
  handleConfirmOnPageExit: require('./handleConfirmOnPageExit'),

  handleCampaignContribution: require('./handleCampaignContribution'),
  handleCampaignRefund: require('./handleCampaignRefund'),
};
