// utils
const utils = require('../utils');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;

// require components
const components = require('../components');

// environment
const environment = require('../environment');
const getNetwork = environment.getNetwork;
const getLocale = environment.getLocale;
const txObject = environment.txObject;
const getDefaultAccount = environment.getDefaultAccount;
const setDefaultAccount = environment.setDefaultAccount;
const setLocale = environment.setLocale;

// campaign environment methods
const getCampaign = environment.getCampaign;
const setCampaign = environment.setCampaign;
const getCampaigns = environment.getCampaigns;

// web3
const web3 = require('../web3').web3;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('../contracts');
const classes = require('../contracts').classes;
const campaignRegistry = contracts.campaignRegistryContract;
const staffPicks = contracts.staffPicksContract;
const campaignDataRegistry = contracts.campaignDataRegistryContract;
const standardCampaignFactory = contracts.standardCampaignContractFactory;
const campaign = contracts.campaignContractFactory;

// loadCampaign method
const lib = require('../lib');
const getCampaignData = lib.getCampaign;
const getCampaignsData = lib.getCampaigns;

// router
const refreshPageButtons = require('../router').refreshPageButtons;

// require i18n
const t = require('../i18n').t;

// draw utils
const buildAllNavToggles = require('../utils').buildAllNavToggles;
const buildAllInputSliders = require('../utils').buildAllInputSliders;

const handleStartCampaign = require('./handleStartCampaign');

const buildLocaleToggles = function() {
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

      console.log(getLocale());

      // localtion reload
      location.reload();
    });
  });
};

const drawFooter = function() {
  document.body.querySelector('#footer-wrapper').innerHTML = components.footer({t: t});
  buildLocaleToggles();
};

const drawNavBar = function() {
  document.body.querySelector('#nav-wrapper').innerHTML = components.navBar({t: t});
  buildAllNavToggles();
  buildLocaleToggles();
};

// start campaign draw
const drawStartCampaignView = function(options) {
  document.querySelector('#view-start-campaign').innerHTML = components.startCampaignView({t: t});

  // build all sliders
  buildAllInputSliders();

  document.querySelector('#startCampaign_useMyAccount').addEventListener('click', function(event){
    document.querySelector('#startCampaign_beneficiary').value = getDefaultAccount();
  });

  // add start campaign button
  document.querySelector('#startCampaign_button').addEventListener('click', handleStartCampaign);
};

// module exports
module.exports = {
  drawNavBar: drawNavBar,
  drawFooter: drawFooter,
  drawStartCampaignView: drawStartCampaignView,

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
