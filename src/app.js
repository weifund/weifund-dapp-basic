// environment
const setDefaultAccount = require('./environment').setDefaultAccount;

// web3 instance and setup method
const web3 = require('./web3').web3;
const setupWeb3Provider = require('./web3').setupWeb3Provider;

// ipfs instance and setup
const setupIPFSProvider = require('./ipfs').setupIPFSProvider;

// router instance
const router = require('./router');
const setupRouter = router.setupRouter;
const getRouter = router.getRouter;

// handlers draw
const handlers = require('./handlers');
const drawNavBar = handlers.drawNavBar;
const drawFooter = handlers.drawFooter;
const drawStartCampaignView = handlers.drawStartCampaignView;
const loadAndDrawCampaign = handlers.loadAndDrawCampaign;
const loadAndDrawCampaignsList = handlers.loadAndDrawCampaignsList;
const loadAndDrawCampaignContribute = handlers.loadAndDrawCampaignContribute;
const loadAndDrawCampaignPayout = handlers.loadAndDrawCampaignPayout;
const loadAndDrawCampaignRefund = handlers.loadAndDrawCampaignRefund;
const handleConfirmOnPageExit = handlers.handleConfirmOnPageExit;
const loadAndDrawAccount = handlers.loadAndDrawAccount;

// draw navbar
drawNavBar();

// draw startcampaign page
drawStartCampaignView();

// load application
const loadApp = function() {
  // window warnign message
  window.onunload = window.onbeforeunload = handleConfirmOnPageExit;

  // setup the web3 provider
  setupWeb3Provider();
  setupIPFSProvider();

  // setup the router
  setupRouter({
    loadAndDrawCampaignPayout: loadAndDrawCampaignPayout,
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
};

// setup provider
// attempt conenction and run system
window.addEventListener('load', loadApp);
