// environment
import { setDefaultAccount } from './environment';

// ipfs instance and setup
import networkDetective from 'web3-network-detective';

// web3 instance and setup method, and ipfs
import  { web3, setupWeb3Provider } from './web3';
import  { setupIPFSProvider } from './ipfs';

// router instance
import { setupRouter, getRouter } from './router';

// handlers draw
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

  // fix mac focus
  if (navigator.userAgent.toLowerCase().indexOf('mac') !== -1) {
    document.body.style.zoom = '0.8';
  }

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

  // select default account
  web3.eth.getAccounts(function(accountsError, accounts){
    if (!accountsError && accounts.length) {
      setDefaultAccount(accounts[0]);
    }
  });

  // draw footer later
  drawFooter();
}
