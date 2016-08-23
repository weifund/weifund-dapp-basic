// router, href and history
const sheetRouter = require('sheet-router');
const href = require('sheet-router/href');
const history = require('sheet-router/history');

// router instance
var router;

// get router instance
const getRouter = function() {
  return router;
};

// returns a setup router
const setupRouter = function(options) {
  // default to `/404` if no path matches
  // router setup
  router = sheetRouter('/404', [
    /* ['/', function(params) {
      options.loadAndDrawCampaignsList();

      options.openView('view-landing');
    }], */
    ['/', function(params) {
      options.loadAndDrawCampaignsList();

      options.openView('view-list');
    }],
    /* ['/start', function(params){
      options.openView('view-start');
    }],
    ['/register', function(params){
      options.openView('view-register');
    }],
    ['/account', function(params){
      options.openView('view-account');
    }], */
    ['/campaign/:campaignID', function(params) {
      // draw campaign
      options.loadAndDrawCampaign(parseInt(params.campaignID));

      options.openView('view-focus');
    }, [
      ['/contribute', function(params) {
        // draw campaign
        options.loadAndDrawCampaign(parseInt(params.campaignID));

        options.openView('view-campaign-contribute');
      }, [
        ['/receipt', function(params) {
          options.openView('view-campaign-contribute-receipt');
        }]
      ]],
      ['/payout', function(params) {
        // draw campaign
        options.loadAndDrawCampaign(parseInt(params.campaignID));

        options.openView('view-campaign-payout');
      }, [
        ['/receipt', function(params) {
          options.openView('view-campaign-payout-receipt');
        }]
      ]],
      ['/refund', function(params) {
        // draw campaign
        options.loadAndDrawCampaign(parseInt(params.campaignID));

        options.openView('view-campaign-refund');
      }, [
        ['/receipt', function(params) {
          options.openView('view-campaign-refund-receipt');
        }]
      ]]
    ]],
    ['/404', function(params) {
      options.openView('view-404');
    }],
  ]);

  // enable routing history
  history(function (href) {
    router(href);
  });
};

// refresh all view page buttons
const refreshPageButtons = function() {
  // enable routing history
  href(function (href) {
    getRouter()(href);
  });
};

// router exports
module.exports = {
  router: router,
  getRouter: getRouter,
  setupRouter: setupRouter,
  refreshPageButtons: refreshPageButtons,
};
