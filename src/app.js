// view handling
const views = require('./views');
const closeAllViews = views.closeAllViews;
const openView = views.openView;

// environment
const environment = require('./environment');
const setDefaultAccount = environment.setDefaultAccount;

// web3 instance and setup method
const web3 = require('./web3').web3;
const setupWeb3Provider = require('./web3').setupWeb3Provider;

// ipfs instance and setup
const setupIPFSProvider = require('./ipfs').setupIPFSProvider;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('./contracts');
const campaignRegistry = contracts.campaignRegistryContract;
const staffPicks = contracts.staffPicksContract;
const campaignDataRegistry = contracts.campaignDataRegistryContract;

// loadCampaign method
// load campaigns
const loadTransaction = require('./lib/loadTransaction');

// router instance
const router = require('./router');
const setupRouter = router.setupRouter;
const getRouter = router.getRouter;

// require i18n
const t = require('./i18n').t;

// handlers draw
const handlers = require('./handlers');
const drawNav = handlers.drawNav;
const drawDetails = handlers.drawDetails;
const drawSelectedAccount = handlers.drawSelectedAccount;
const drawLocale = handlers.drawLocale
const drawStaffPicksAddress = handlers.drawStaffPicksAddress;

const loadAndDrawCampaign = handlers.loadAndDrawCampaign;
const drawCampaigns = handlers.drawCampaigns;

const handleNewCampaign = handlers.handleNewCampaign;
const handleRegisterCampaign = handlers.handleRegisterCampaign;
const handleCampaignContribution = handlers.handleCampaignContribution;
const handleCampaignRefund = handlers.handleCampaignRefund;
const handleCampaignPayout = handlers.handleCampaignPayout;
const handleRegisterCampaignData = handlers.handleCampaignPayout;
const loadAndDrawCampaignsList = handlers.loadAndDrawCampaignsList;

// draw the nav
drawNav();

// close all first
closeAllViews();

// load application
const loadApp = function() {
  // setup the web3 provider
  setupWeb3Provider();
  setupIPFSProvider();

  require('./lib/getCampaign')(5, function(err, result){
    console.log(err, result);
  });

  // setup the router
  setupRouter({
    openView: openView,
    loadAndDrawCampaignsList: loadAndDrawCampaignsList,
    loadAndDrawCampaign: loadAndDrawCampaign
  });

  // set initial route from params
  getRouter()(window.location.pathname);

  // draw picks address
  drawStaffPicksAddress(staffPicks.address);
  drawDetails(campaignRegistry, campaignDataRegistry);
  drawLocale();

  // select default account
  web3.eth.getAccounts(function(accountsError, accounts){
    if (!accountsError && accounts.length) {
      setDefaultAccount(accounts[0]);
      drawSelectedAccount();
    }
  });

  // new campaign
  document.querySelector('#newCampaign').addEventListener('click', handleNewCampaign);

  // add payout event listener
  document.querySelector('#payout').addEventListener('click', handleCampaignPayout);

  // add contribute event listener
  document.querySelector('#contribute').addEventListener('click', handleCampaignContribution);

  // register campaign button
  document.querySelector('#registerCampaign').addEventListener('click', handleRegisterCampaign);

  // ipfs register
  document.querySelector('#registerCampaignData').addEventListener('click', handleRegisterCampaignData);
};

// setup provider
// attempt conenction and run system
window.addEventListener('load', loadApp);
