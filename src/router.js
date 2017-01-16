// router, href and history
import sheetRouter from 'sheet-router';
const href = require('sheet-router/href'); // eslint-disable-line
const history = require('sheet-router/history'); // eslint-disable-line

// view handling
import { closeAllViews, openView, openSubView } from './views';

// router instance
// campaign is loaded
var router;
var campaignIdOfLoadedFocus = false;
var campaignContributeIdOfLoadedFocus = false;

// get router instance
function getRouter() {
  return router;
}

// open campaign helper
function openCampaign(options, params, callback) {
  if (campaignIdOfLoadedFocus === parseInt(params.campaignID, 10)) {
    callback(null, true);
    return;
  }

  openView('view-focus');
  options.loadAndDrawCampaign(parseInt(params.campaignID, 10), callback);
  campaignIdOfLoadedFocus = parseInt(params.campaignID, 10);
  campaignContributeIdOfLoadedFocus = false;
}

// open campaign contribute
function openCampaignContribute(options, params, callback) {
  // draw campaign
  openView('view-campaign-contribute');

  // if we are already focused on campaign
  if (campaignContributeIdOfLoadedFocus === parseInt(params.campaignID, 10)) {
    callback(null, true);
    return;
  }

  // set campaign id
  campaignIdOfLoadedFocus = false;
  campaignContributeIdOfLoadedFocus = parseInt(params.campaignID, 10);

  // load and draw campaign
  // something WRONG HERE..
  options.loadAndDrawCampaignContribute(parseInt(params.campaignID, 10), callback);
}

// open campaign contribute
function openCampaignRefund(options, params, callback) {
  // draw campaign
  openView('view-campaign-refund');

  if (campaignContributeIdOfLoadedFocus === parseInt(params.campaignID, 10)) {
    callback(null, true);
    return;
  }

  options.loadAndDrawCampaignRefund(parseInt(params.campaignID, 10), callback);
  campaignIdOfLoadedFocus = false;
  campaignContributeIdOfLoadedFocus = parseInt(params.campaignID, 10);
}

// returns a setup router
function setupRouter(options) {

  // default to `/404` if no path matches
  // router setup
  router = sheetRouter({ default: '/404' }, [
    ['/', function(params) {
      campaignIdOfLoadedFocus = false;
      campaignContributeIdOfLoadedFocus = false;
      options.loadAndDrawCampaignsList();

      openView('view-list');
    }],
    ['/account', function(params){
      openView('view-account');

      options.loadAndDrawAccount(() => {
        openSubView('view-account-restore');
      });
    }, [
      ['/panel', function(params) {
        openView('view-account');

        options.loadAndDrawAccount(() => {
          openSubView('view-account-panel');
        });
      }],
    ]],
    ['/campaign/:campaignID', function(params) {
      // draw campaign
      openCampaign(options, params, function(e, r){
        openSubView('view-campaign-info');
      });
    }, [
      ['/info', function(params) {
        openCampaign(options, params, function(e, r){
          openSubView('view-campaign-info');
        });
      }],
      ['/details', function(params) {
        openCampaign(options, params, function(e, r){
          openSubView('view-campaign-details');
        });
      }],
      ['/contracts', function(params) {
        openCampaign(options, params, function(e, r){
          openSubView('view-campaign-contracts');
        });
      }],
      ['/qr', function(params) {
        openCampaign(options, params, function(e, r){
          openSubView('view-campaign-qr');
        });
      }],
      ['/contribute', function(params) {
        openCampaignContribute(options, params, function(err, result){
          openSubView('view-campaign-contribute-wallet');
        });
      }, [
        ['/wallet', function(params) {
          openCampaignContribute(options, params, function(err, result){
            openSubView('view-campaign-contribute-wallet');
          });
        },
        [
          ['/restore', function(params) {
            openCampaignContribute(options, params, function(err, result){
              openSubView('view-campaign-contribute-wallet-restore');
            });
          }],
          ['/entropy', function(params) {
            openCampaignContribute(options, params, function(err, result){
              openSubView('view-campaign-contribute-wallet-entropy');
            });
          }],
          ['/confirm', function(params) {
            openCampaignContribute(options, params, function(err, result){
              openSubView('view-campaign-contribute-wallet-confirm');
            });
          }],
          ['/seed', function(params) {
            openCampaignContribute(options, params, function(err, result){
              openSubView('view-campaign-contribute-wallet-seed');
            });
          }],
          ['/password', function(params) {
            openCampaignContribute(options, params, function(err, result){
              openSubView('view-campaign-contribute-wallet-password');
            });
          }],
          ['/balance', function(params) {
            openCampaignContribute(options, params, function(err, result){
              openSubView('view-campaign-contribute-wallet-balance');
            });
          }],
          ['/download', function(params) {
            openCampaignContribute(options, params, function(err, result){
              openSubView('view-campaign-contribute-wallet-download');
            });
          }],
        ]
        ],
        ['/form', function(params) {
          openCampaignContribute(options, params, function(err, result){
            openSubView('view-campaign-contribute-form');
          });
        }],
        ['/review', function(params) {
          openCampaignContribute(options, params, function(err, result){
            openSubView('view-campaign-contribute-review');
          });
        }],
        ['/receipt', function(params) {
          openCampaignContribute(options, params, function(err, result){
            openSubView('view-campaign-contribute-receipt');
          });
        }]
      ]],
      ['/refund', function(params) {
        openCampaignRefund(options, params, function(err, result){
          openSubView('view-campaign-refund-form');
        });
      }, [
        ['/review', function(params) {
          openCampaignRefund(options, params, function(err, result){
            openSubView('view-campaign-refund-review');
          });
        }],
        ['/receipt', function(params) {
          openCampaignRefund(options, params, function(err, result){
            openSubView('view-campaign-refund-receipt');
          });
        }]
      ]]
    ]],
    ['/404', function(params) {
      openView('view-404');
    }],
  ]);

  // enable routing history
  history(function (href) {
    router(href);
  });
}

// refresh all view page buttons
function refreshPageButtons() {
  // enable routing history
  href(function (href) {
    getRouter()(href);
  });
}

// router exports
module.exports = {
  router,
  getRouter,
  setupRouter,
  refreshPageButtons,
};
