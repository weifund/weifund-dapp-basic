import networkDetective from 'web3-network-detective';

import { setDefaultAccount } from './environment';
import  { web3, setupWeb3Provider } from './web3';
import  { setupIPFSProvider } from './ipfs';
import { setupRouter, getRouter } from './router';
import { drawNavBar, drawFooter, loadAndDrawCampaign,
  loadAndDrawCampaignsList, loadAndDrawCampaignContribute, loadAndDrawCampaignRefund, handleConfirmOnPageExit,
  loadAndDrawAccount } from './handlers';

// draw navbar
drawNavBar();

// setup provider
// attempt conenction and run system
window.addEventListener('load', loadApp);

// load application
function loadApp(loadAppEvent) {
  // window warnign message
  window.onunload = window.onbeforeunload = handleConfirmOnPageExit;

  // setup the web3 provider
  if (loadAppEvent.bypassWeb3Provider !== true) {
    setupWeb3Provider();
  } else {
    web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/'));
  }

  // setup ipfs instance
  setupIPFSProvider();

  // setup the router
  setupRouter({
    loadAndDrawCampaignContribute: loadAndDrawCampaignContribute,
    loadAndDrawCampaignRefund: loadAndDrawCampaignRefund,

    loadAndDrawCampaign: loadAndDrawCampaign,
    loadAndDrawCampaignsList: loadAndDrawCampaignsList,
    loadAndDrawAccount: loadAndDrawAccount,
  });

  // set initial route from params
  getRouter()(window.location.pathname);

  // draw footer later
  drawFooter();
}
