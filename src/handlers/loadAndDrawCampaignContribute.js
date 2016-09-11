// requires
const QRious = require('qrious');

// utils
const utils = require('weifund-util');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;
const parseSolidityMethodName = utils.parseSolidityMethodName;
const parseSolidityMethodInterface = utils.parseSolidityMethodInterface;
const oneDay = utils.oneDay;

// require components
const components = require('../components');

// environment
const environment = require('../environment');
const getNetwork = environment.getNetwork;
const getLocale = environment.getLocale;
const getContractEnvironment = environment.getContractEnvironment;
const txObject = environment.txObject;
const getDefaultAccount = environment.getDefaultAccount;

// campaign environment methods
const getCampaign = environment.getCampaign;
const setCampaign = environment.setCampaign;

// web3
const web3 = require('../web3').web3;

// web3
const ipfs = require('../ipfs').ipfs;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('weifund-contracts');
const campaignRegistry = contracts.CampaignRegistry(web3, getNetwork());

// loadCampaign method
const lib = require('weifund-lib');
const getCampaigns = lib.getCampaigns;

// router instance
var router = require('../router');
const getRouter = router.getRouter;
const refreshPageButtons = router.refreshPageButtons;

// handle cmapaign contribution
const handleCampaignContribution = require('./handleCampaignContribution');

// require i18n
const t = require('../i18n').t;

// build all input sliders
const buildAllInputSliders = require('./drawAllInputSliders');

function updateCampaignContributeReview() {
  const contributeAmount = document.querySelector('#campaign_contributeAmount').value;
  const weifundContributeAmount = document.querySelector('#campaign_weifundContributeAmount').value;
  var contributeTotal = parseFloat(contributeAmount) + parseFloat(weifundContributeAmount);

  if (isNaN(contributeTotal)) {
    contributeTotal = 0;
  }

  // if contribution greater than zero
  if (parseFloat(weifundContributeAmount) > 0) {
    document.querySelector('#campaign_contributeReview_transactionTotal').innerHTML = 2;
  } else {
    document.querySelector('#campaign_contributeReview_transactionTotal').innerHTML = 1;
  }

  document.querySelector('#campaign_contributeReview_contributeAmount').innerHTML = contributeAmount;
  document.querySelector('#campaign_contributeReview_weifundContributeAmount').innerHTML = weifundContributeAmount;
  document.querySelector('#campaign_contributeReview_totalContributeAmount').innerHTML = contributeTotal;
};

// load and draw campaign contribute page/flow
const loadAndDrawCampaignContribute = function(campaignID, callback) {
  // handle empty callback
  if (typeof callback !== 'function') {
    callback = function(e, r) {};
  }

  // draw loader
  document.querySelector('#view-campaign-contribute').innerHTML = components.viewLoader({t: t});

  // load campaign fresh to draw
  getCampaigns({
    // set network
    // or 'testnet'
    network: getNetwork(),

    // set campaign selector
    // array (i.e. array of campaignIDs)
    selector: [campaignID],

    // set web3 provider
    web3Provider: web3.currentProvider,

    // set ipfs provider
    ipfsProvider: ipfs.currentProvider,
  }, function(campaignLoadError, campaignDataObject){
    if (campaignLoadError) {
      log('Campaign load while drawing...', campaignLoadError);
      callback(campaignLoadError, null);
      return;
    }

    // campaign data
    const campaignData = campaignDataObject[campaignID];

    // save in campaigns
    setCampaign(campaignID, campaignData);

    // draw campaign focus
    document.querySelector('#view-campaign-contribute').innerHTML = components.campaignContributeView({
      campaignObject: campaignData,
      getLocale: getLocale,
      web3: web3,
      defaultAccount: getDefaultAccount
    });

    // draw qr code
    const qr = new QRious({
      element: document.querySelector('#campaign-contribute-qrcode'),
      size: 250,
      value: campaignData.addr,
    });

    // initially update review page
    updateCampaignContributeReview();

    // weifund amount contributor amount
    document.querySelector('#campaign_weifundContributeAmount').addEventListener('change', updateCampaignContributeReview);

    // weifund amount contributor amount
    document.querySelector('#campaign_contributeAmount').addEventListener('change', updateCampaignContributeReview);

    // handleCampaignContribution
    document.querySelector('#campaign_reviewContributeButton').addEventListener('click', handleCampaignContribution);

    // handle button click/disclaimer
    // document.querySelector('#campaign-contribute-disclaimer')
    // document.querySelector('#campaign-contribute-disclaimer').checked
    // document.querySelector('#campaign-contribute-review-button')

    // reset contribute inputs dom draw
    //document.querySelector('#campaignContribution_inputs').innerHTML = '';
    var campaignContributionInputHTML = ``;

    // draw contribution inputs
    campaignData.contributeMethodABIObject.inputs.forEach(function(contributeInput, contributeInputIndex) {

      // set default dom ID and input type
      const contributionInputID = `campaign_contributionInput_${contributeInputIndex}`;
      var contirbutionInputType = 'text';

      // if type is numerical
      if (String(contributeInput.type).indexOf('int') !== -1) {
        contirbutionInputType = 'number';
      }

      // is type a bool
      if (contributeInput.type === 'bool') {
        contirbutionInputType = 'bool';
      }

      campaignContributionInputHTML += `

      <br />

      <h3>${parseSolidityMethodName(contributeInput.name)}*</h3>
      <h4>This is a custom campaign input. The campaign operator has not set a description for this input.</h4>

      <br />

      `;

      // if type is a bool
      if (contirbutionInputType === 'bool') {
        campaignContributionInputHTML += `

        <div class="row">
          <div class="col-xs-12 col-sm-12">
            <select id="${contributionInputID}" placeholder="${contributeInput.name}">
              <option value="0">False (no)</option>
              <option value="1">True (yes)</option>
             </select>
          </div>
        </div>

         `;
      } else if (contirbutionInputType === 'number') {
        campaignContributionInputHTML += `

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-8">
            <div class="input-slider input-slider-lg" data-input-id="campaign_input_1">
              <div class="input-slider-rail">
                <div class="input-slider-rail-highlight"></div>
                <div class="input-slider-bar"></div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="input-group">
              <input type="text" id="${contributionInputID}" class="form-control input-lg" placeholder="i.e. 400" aria-describedby="basic-addon2" />
              <span class="input-group-addon" id="basic-addon2">gnosis</span>
            </div>
          </div>
        </div>

        `;
      } else {
        campaignContributionInputHTML += `

        <div class="row">
          <div class="col-xs-12 col-sm-12">
            <input type="${contirbutionInputType}" id="${contributionInputID}" placeholder="${parseSolidityMethodName(contributeInput.name)}" />
          </div>
        </div>

        `;
      }
    });

    // set campaign contribution custom inputs
    document.querySelector('#campaignContribution_inputs').innerHTML = campaignContributionInputHTML;

    // refresh all page buttons after redraw
    refreshPageButtons();

    // build all sliders
    buildAllInputSliders();

    // callback
    callback(null, true);
  });
};

module.exports = loadAndDrawCampaignContribute;
