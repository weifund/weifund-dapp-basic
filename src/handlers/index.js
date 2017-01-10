// require components
import { footer, navBar, startCampaignView } from '../components';

// document helper
import { el } from '../document';

// environment
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';

// require i18n
import { t } from '../i18n';

// draw utils
import buildAllNavToggles from './drawAllNavToggles';
import buildAllInputSliders from './drawAllInputSliders';
import handleStartCampaign from './handleStartCampaign';

// export
function buildLocaleToggles() {
  [].slice.call(document.querySelectorAll('.input-locale-toggle')).forEach(function(inputToggleElement){
    // check if toggle is listening
    if (inputToggleElement.dataset.listening) {
      return;
    }

    // add supported locales
    inputToggleElement.innerHTML = `
      <option>Locale</option>
      <option value="en">en</option>
      <option value="zh">zh</option>
    `;

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
  document.body.querySelector('#footer-wrapper').innerHTML = footer({t: t});
  buildLocaleToggles();
}

function drawNavBar() {
  document.body.querySelector('#nav-wrapper').innerHTML = navBar({t: t});
  buildAllNavToggles();
  buildLocaleToggles();
}

// start campaign draw
function drawStartCampaignView(options) {
  el('#view-start-campaign').innerHTML = startCampaignView({t: t});

  // build all sliders
  buildAllInputSliders();

  el('#startCampaign_useMyAccount').addEventListener('click', function(event){
    el('#startCampaign_beneficiary').value = getDefaultAccount();
  });

  // add start campaign button
  el('#startCampaign_button').addEventListener('click', handleStartCampaign);
}

// module exports
module.exports = {
  drawNavBar,
  drawFooter,
  drawStartCampaignView,

  loadAndDrawCampaign: require('./loadAndDrawCampaign'),
  loadAndDrawCampaignRefund: require('./loadAndDrawCampaignRefund'),
  loadAndDrawCampaignPayout: require('./loadAndDrawCampaignPayout'),
  loadAndDrawCampaignContribute: require('./loadAndDrawCampaignContribute'),
  loadAndDrawCampaignsList: require('./loadAndDrawCampaignsList'),
  loadAndDrawAccount: require('./loadAndDrawAccount'),
  handleConfirmOnPageExit: require('./handleConfirmOnPageExit'),

  handleStartCampaign: handleStartCampaign,
  handleRegisterCampaign: require('./handleCampaignRegistration'),
  handleCampaignContribution: require('./handleCampaignContribution'),
  handleCampaignRefund: require('./handleCampaignRefund'),
  handleCampaignPayout: require('./handleCampaignPayout'),
  handleRegisterCampaignData: require('./handleCampaignDataRegistration'),
};
