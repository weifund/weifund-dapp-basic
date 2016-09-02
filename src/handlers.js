// requires
const QRious = require('qrious');

// utils
const utils = require('./utils/');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;
const parseCampaignRegistryData = utils.parseCampaignRegistryData;
const buildInputsArray = utils.buildInputsArray;
const parseSolidityMethodName = utils.parseSolidityMethodName;
const parseSolidityMethodInterface = utils.parseSolidityMethodInterface;
const oneDay = utils.oneDay;
const filterXSSObject = utils.filterXSSObject;

// require components
const components = require('./components');

// view handling
const views = require('./views');
const closeAllViews = views.closeAllViews;
const openView = views.openView;

// environment
const environment = require('./environment');
const getNetwork = environment.getNetwork;
const getLocale = environment.getLocale;
const getContractEnvironment = environment.getContractEnvironment;
const txObject = environment.txObject;
const getDefaultAccount = environment.getDefaultAccount;
const setDefaultAccount = environment.setDefaultAccount;

// campaign environment methods
const getCampaign = environment.getCampaign;
const setCampaign = environment.setCampaign;
const getCampaigns = environment.getCampaigns;

// web3
const web3 = require('./web3').web3;

// ipfs instance
const ipfs = require('./ipfs').ipfs;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('./contracts');
const classes = require('./contracts').classes;
const campaignRegistry = contracts.campaignRegistryContract;
const staffPicks = contracts.staffPicksContract;
const campaignDataRegistry = contracts.campaignDataRegistryContract;
const standardCampaignFactory = contracts.standardCampaignContractFactory;
const campaign = contracts.campaignContractFactory;

// loadCampaign method
const lib = require('./lib');
const getCampaignData = lib.getCampaign;
const getCampaignsData = lib.getCampaigns;

// router instance
var router = require('./router');
const getRouter = router.getRouter;
const refreshPageButtons = router.refreshPageButtons;

// require i18n
const t = require('./i18n').t;

const outerElHeight = function(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
};

const handleStartCampaign = require('./handlers/handleStartCampaign');

// buidl all nav togglesbuildAllNavToggles
const buildAllNavToggles = function() {
  [].slice.call(document.querySelectorAll('.navbar-toggle')).forEach(function(navBarToggle){
    navBarToggle.addEventListener('click', function(event){

      var toggleState = false;
      const toggleTarget = document.querySelector(`#${navBarToggle.dataset.targetId}`);

      const getToggleState = function() {
        return toggleState();
      };

      if (toggleTarget !== null && toggleTarget.length !== 0) {
        const toggleTargetOuterHeight = outerElHeight(toggleTarget);
        const toggleTargetFirsChildOuterHeight = outerElHeight(toggleTarget.children[0]);

        if (toggleTargetOuterHeight === 0) {
          toggleTarget.style.height = `${toggleTargetFirsChildOuterHeight}px`;
        } else {
          toggleTarget.style.height = `0px`;
        }
      }
    });
  });
};

const drawFooter = function() {
  document.body.querySelector('#footer-wrapper').innerHTML = components.footer();
}

const drawNavBar = function() {
  document.body.querySelector('#nav-wrapper').innerHTML = components.navBar();
  buildAllNavToggles();
}

// draw details
const drawDetails = function(campaignRegistryInstance, campaignDataRegistryInstance) {
  document.querySelector('#details_campaignRegistryAddr').innerHTML = campaignRegistryInstance.address;
  document.querySelector('#details_campaignDataRegistryAddr').innerHTML = campaignDataRegistryInstance.address;
}

// register campaign data
const handleRegisterCampaignData = function(){
  const campaignAddress = document.querySelector('#registerCampaignData_campaign').value;
  const ipfsHash = document.querySelector('#registerCampaignData_ipfsHash').value;
  const ipfsHashHex = ipfs.utils.base58ToHex(ipfsHash);
  const ipfsHashBytecode = `0x${ipfsHashHex}`;

  // register data with data registry
  campaignDataRegistry.register(campaignAddress, ipfsHashBytecode, function(registerDataError, registerDataResult){
    log('Reg', registerDataError, registerDataResult);
  });
};

// handle payout
const handleCampaignPayout = function(event){
  // payout awaiting approval
  document.querySelector('#payout_response').innerHTML = `Your campaign payout transaction is awaiting approval..`;

  // get campaign for payout
  const selectedCampaignIdInput = parseInt( document.querySelector('#campaign_id').value);
  const selectedCampaign = getCampaign(selectedCampaignIdInput);

  // build contract factory, instance
  const campaignContractFactory = web3.eth.contract(selectedCampaign.abi);
  const campaignContractInstance = campaignContractFactory.at(selectedCampaign.addr);
  const payoutMethodName = selectedCampaign.payoutMethodABIObject.name;
  var payoutParams = [];

  // note:
  // add additional payout params here, if any..

  // add tx object and callback
  payoutParams.push(txObject());
  payoutParams.push(function(payoutError, payoutResultTxHash){
    if (payoutError) {
      document.querySelector('#payout_response').innerHTML = `There was an error while paying out your campaign:  ${String(JSON.stringify(payoutError, null, 2))}`;
    }

    // if tx hash present
    if (payoutResultTxHash) {
      document.querySelector('#payout_response').innerHTML = `Your payout transaction is processing with transaction hash:  ${payoutResultTxHash}`;
    }
  });

  // contribute to campaign instance
  campaignContractInstance[payoutMethodName].apply(campaignContractInstance, payoutParams);
};

// handle a campaign contribution
const handleCampaignContribution = require('./handlers/handleCampaignContribution');

const outerElWidth = function(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
};

// build all input sliders
const buildAllInputSliders = function() {
  [].slice.call(document.querySelectorAll('.input-slider')).forEach(function(inputSliderElement){
    // setup rail and bar
    const inputSliderRailHighlight = inputSliderElement.querySelector('.input-slider-rail-highlight');
    const inputSliderRail = inputSliderElement.querySelector('.input-slider-rail');
    const inputSliderBar = inputSliderElement.querySelector('.input-slider-bar');
    var inputSliderDraggable = false;

    // setup slider state getter
    const getSliderState = function() {
      return inputSliderDraggable;
    };

    // setup slider mouseup handler
    const handleInputSliderMouseUp = function(event) {
      inputSliderDraggable = false;
    };

    // setup slider mouse down handler
    const handleInputSliderMouseDown = function(event) {
      inputSliderDraggable = true;
      handleInputSliderMouseMove(event);
      event.preventDefault();
    };

    // setup slider mouse move handler
    const handleInputSliderMouseMove = function(event){
      if (!getSliderState()) {
        return;
      }

      // slider width, offset position, baroffsetleft, mouse position
      // calculare shim, mouse fix and bar position
      const sliderWidth = outerElWidth(inputSliderElement);
      const sliderOffsetLeft = inputSliderElement.getBoundingClientRect().left;
      const sliderBarOffsetLeft = inputSliderBar.getBoundingClientRect().left;
      const clientX = event.clientX;
      var barLeftPositionShim = (parseFloat(((clientX - sliderOffsetLeft) / sliderWidth) - 1).toFixed(2) * 17) * -1;
      var barLeftPositionPercentage = ((clientX - barLeftPositionShim - sliderOffsetLeft) / sliderWidth) * 100;

      // fix invarience
      if (barLeftPositionPercentage > 100 || clientX > sliderOffsetLeft + sliderWidth) {
        barLeftPositionPercentage = 100;
      }

      // fix invarience
      if (barLeftPositionPercentage < 0 || clientX < sliderOffsetLeft) {
        barLeftPositionPercentage = 0;
      }

      // handle input id
      if (typeof inputSliderElement.dataset.inputId === 'string') {
        const dataInputElement = document.querySelector(`#${inputSliderElement.dataset.inputId}`);

        // if element exists
        if (dataInputElement !== null && dataInputElement.length !== 0) {
          dataInputElement.value = parseFloat(barLeftPositionPercentage).toFixed(2);
        }
      }

      // set input slider bar left position
      inputSliderBar.style.left = `${barLeftPositionPercentage}%`;
      inputSliderRailHighlight.style.width = `${barLeftPositionPercentage}%`;
    };

    // handle input change
    if (typeof inputSliderElement.dataset.inputId === 'string') {
      const dataInputElement = document.querySelector(`#${inputSliderElement.dataset.inputId}`);

      // handle input element change
      const handleInputElementChange = function(event) {
        var inputElementValue = parseInt(dataInputElement.value, 10);

        if (inputElementValue > 100) {
          inputElementValue = 100;
        }

        if (inputElementValue < 0) {
          inputElementValue = 0;
        }

        if (!isNaN(inputElementValue)) {
          // set input slider bar left position
          inputSliderBar.style.left = `${inputElementValue}%`;
          inputSliderRailHighlight.style.width = `${inputElementValue}%`;
        }
      };

      // instantiate initial handler default input
      handleInputElementChange({});

      // mouse move listener
      document.body.addEventListener('change', handleInputElementChange, false);
    }

    // mouse move listener
    document.body.addEventListener('mousemove', handleInputSliderMouseMove, false);

    // mouse down lisener
    inputSliderElement.addEventListener('mousedown', handleInputSliderMouseDown, false);

    // mouse up listeners
    inputSliderRail.addEventListener('mouseup', handleInputSliderMouseUp, false);
    inputSliderBar.addEventListener('mouseup', handleInputSliderMouseUp, false);
    document.body.addEventListener('mouseup', handleInputSliderMouseUp, false);

  });
};

const loadAndDrawCampaignPayout = function(campaignID, callback) {
  // handle empty callback
  if (typeof callback !== 'function') {
    callback = function(e, r) {};
  }

  // draw loader
  document.querySelector('#view-campaign-payout').innerHTML = components.viewLoader();

  // load campaign fresh to draw
  getCampaignData(campaignID, function(campaignLoadError, campaignData){
    if (campaignLoadError) {
      log('Campaign load while drawing...', campaignLoadError);
      callback(campaignLoadError, null);
      return;
    }

    // save in campaigns
    setCampaign(campaignID, campaignData);

    // draw campaign focus
    document.querySelector('#view-campaign-payout').innerHTML = components.campaignPayoutView({campaignObject: campaignData, getLocale: getLocale});

    // refresh all page buttons after redraw
    refreshPageButtons();

    // build all sliders
    buildAllInputSliders();

    // callback
    callback(null, true);
  });
};

const loadAndDrawCampaignContribute = require('./handlers/loadAndDrawCampaignContribute');

/*const loadAndDrawCampaignContribute = function(campaignID, callback) {
  // handle empty callback
  if (typeof callback !== 'function') {
    callback = function(e, r) {};
  }

  // draw loader
  document.querySelector('#view-campaign-contribute').innerHTML = components.viewLoader();

  // load campaign fresh to draw
  getCampaignData(campaignID, function(campaignLoadError, campaignData){
    if (campaignLoadError) {
      log('Campaign load while drawing...', campaignLoadError);
      callback(campaignLoadError, null);
      return;
    }

    // save in campaigns
    setCampaign(campaignID, campaignData);

    // draw campaign focus
    document.querySelector('#view-campaign-contribute').innerHTML = components.campaignContributeView({campaignObject: campaignData, getLocale: getLocale});

    // draw qr code
    const qr = new QRious({
      element: document.querySelector('#campaign-contribute-qrcode'),
      size: 250,
      value: campaignData.addr,
    });

    // refresh all page buttons after redraw
    refreshPageButtons();

    // build all sliders
    buildAllInputSliders();

    // callback
    callback(null, true);
  });
};*/

// load and draw campaign
const loadAndDrawCampaign = require('./handlers/loadAndDrawCampaign');

// register a campaign with the weifund registry
const handleRegisterCampaign = function(){
  const campaignAddress = document.querySelector('#registerCampaign_campaign').value;
  const campaignInterface =  document.querySelector('#registerCampaign_interface').value;

  // awaiting tx approval
  document.querySelector('#registerCampaign_response').innerHTML = `Awaiting transaction approval for campaign registry...`;

  // send register tx
  campaignRegistry.register(campaignAddress, campaignInterface, txObject(), function(registerError, registerTxHash){
    // handle registry error
    if (registerError) {
      document.querySelector('#registerCampaign_response').innerHTML = `There was an error while registering your campaign: ${registerError}`;
      return;
    }

    // positive message
    document.querySelector('#registerCampaign_response').innerHTML = `Registering your campaign with the WeiFund registry... your TX hash is: ${registerTxHash}`;

    // listen for registry tx
    // campaign focus buttons
    campaignRegistry.CampaignRegistered({_campaign: campaignAddress}, function(registerEventError, registerEventResult) {
      if (registerEventError) { // handle error loudly
        document.querySelector('#registerCampaign_response').innerHTML = `There was an error while registering your campaign: [event] ${registerEventError}`;
        return;
      }

      // positive message
      document.querySelector('#registerCampaign_response').innerHTML = `Your campaign has been registered with the WeiFund registry!   ${registerEventResult.transactionHash}`;
    });
  });
};

// handle a campaign refund
const handleCampaignRefund = function() {
};

// draw campaigns
const drawCampaigns = function(campaignsToDraw) {
  // reset inner html
  document.querySelector('#staffpicks_list').innerHTML = ``;
  document.querySelector('#campaigns_list').innerHTML = ``;

  // draw campaigns in list
  for(var campaignID = getCampaigns().length; campaignID >= 0; campaignID--){
    var campaignToDraw = campaignsToDraw[campaignID];
    var campaignDrawTarget = 'campaigns_list';

    // if campaign to draw is no undefined
    if (typeof campaignToDraw !== 'undefined') {

      // campaign is a staff pick, change draw target
      if (campaignToDraw.staffPick === true) {
        document.querySelector(`#staffpicks_list`).innerHTML += components.campaignHighlightMedium(campaignToDraw);
      } else {
        document.querySelector(`#campaigns_list`).innerHTML += components.campaignMedium(campaignToDraw);
      }
    }
  }

  refreshPageButtons();
};

// load all campaigns
const loadAndDrawCampaignsList = function() {
  // draw loader
  document.querySelector('#view-list').innerHTML = components.viewLoader();

  // load campaigns
  getCampaignsData({}, function(loadCampaignsError, loadCampaignsResult){
    // handle errors
    if (loadCampaignsError) {
      document.querySelector('#campaigns_list').innerHTML = `Error while loading campaigns ${JSON.stringify(loadCampaignsError)}`;
      return;
    }

    // draw campaigns page
    document.querySelector('#view-list').innerHTML = components.campaignsView();

    // if load result is nice
    if (typeof loadCampaignsResult === 'object') {
      Object.keys(loadCampaignsResult).forEach(function(campaignID){
        setCampaign(campaignID, loadCampaignsResult[campaignID]);

        // draw campaigns everytime
        drawCampaigns(getCampaigns());
      });
    }
  });
};

// start campaign draw
const drawStartCampaignView = function(options) {
  document.querySelector('#view-start-campaign').innerHTML = components.startCampaignView({});

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

  loadAndDrawCampaign: loadAndDrawCampaign,
  loadAndDrawCampaignPayout: loadAndDrawCampaignPayout,
  loadAndDrawCampaignContribute: loadAndDrawCampaignContribute,
  drawCampaigns: drawCampaigns,
  loadAndDrawCampaignsList: loadAndDrawCampaignsList,
  handleStartCampaign: handleStartCampaign,
  handleRegisterCampaign: handleRegisterCampaign,
  handleCampaignContribution: handleCampaignContribution,
  handleCampaignRefund: handleCampaignRefund,
  handleCampaignPayout: handleCampaignPayout,
  handleRegisterCampaignData: handleRegisterCampaignData,
};
