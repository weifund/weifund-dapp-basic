import { el } from './document';
import { setDefaultAccount } from './environment';
import  { web3, setupWeb3Provider } from './web3';
import  { setupIPFSProvider } from './ipfs';
import { setupRouter, getRouter } from './router';
import { drawNavBar, drawFooter, loadAndDrawCampaign,
  loadAndDrawCampaignsList, loadAndDrawCampaignContribute, handleConfirmOnPageExit,
  loadAndDrawAccount } from './handlers';

// draw navbar
drawNavBar();

// setup provider
// attempt conenction and run system
window.addEventListener('load', loadApp);

// load application
function loadApp(loadAppEvent) {
  // clear initial loader
  el('#initialLoader').remove();

  // window warnign message
  window.onunload = window.onbeforeunload = handleConfirmOnPageExit;

  // setup ipfs instance
  setupIPFSProvider();

  // setup the router
  setupRouter({
    loadAndDrawCampaignContribute: loadAndDrawCampaignContribute,
    loadAndDrawCampaign: loadAndDrawCampaign,
    loadAndDrawCampaignsList: loadAndDrawCampaignsList,
    loadAndDrawAccount: loadAndDrawAccount,
  });

  // set initial route from params
  getRouter()(window.location.pathname);

  // draw footer later
  drawFooter();
}
