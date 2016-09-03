// requires
const QRious = require('qrious');

// utils
const utils = require('../utils/');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;
const oneDay = utils.oneDay;
const emptyWeb3Address = utils.emptyWeb3Address;

// require components
const components = require('../components');

// environment
const environment = require('../environment');
const getNetwork = environment.getNetwork;
const getLocale = environment.getLocale;
const getContractEnvironment = environment.getContractEnvironment;
const txObject = environment.txObject;

// campaign environment methods
const getCampaign = environment.getCampaign;
const setCampaign = environment.setCampaign;
const getCampaigns = environment.getCampaigns;

// web3
const web3 = require('../web3').web3;

// require contracts
const contracts = require('../contracts');
const classes = contracts.classes;
const campaignRegistry = contracts.campaignRegistryContract;
const campaign = contracts.campaignContractFactory;
const ownedContractFactory = contracts.ownedContractFactory;
const standardCampaignContractFactory = contracts.standardCampaignContractFactory;
const standardRefundCampaignFactoryContract = contracts.standardRefundCampaignFactoryContract;

// loadCampaign method
const lib = require('../lib');
const getCampaignData = lib.getCampaign;
const getCampaignsData = lib.getCampaigns;

// router instance
var router = require('../router');
const getRouter = router.getRouter;
const refreshPageButtons = router.refreshPageButtons;

// require i18n
const t = require('../i18n').t;

// reset responses
const resetStartCampaignResponses = function() {
  document.querySelector('#startCampaign_info_response').style.display = 'none';
  document.querySelector('#startCampaign_warning_response').style.display = 'none';
};

// handle new campaign creation
const handleStartCampaign = function(event){
  var newCampaignTransactionHash = '';

  const name = document.querySelector('#startCampaign_name').value;
  const beneficiary = document.querySelector('#startCampaign_beneficiary').value;
  const expiry = Math.round((new Date()).getTime() / 1000) + (parseInt( document.querySelector('#startCampaign_expiry').value) * 86400);
  const fundingGoal = web3.toWei(document.querySelector('#startCampaign_fundingGoal').value, 'ether');
  const confirmMessage = `
  Are you sure you want to create a StandardCampaign with these details:

  Name:
  ${name}

  Beneficiary:
  ${beneficiary}

  Expiry (unix):
  ${expiry}

  Funding Goal (wei):
  ${fundingGoal}
  `;

  // confirm message
  if (confirm(confirmMessage)) {

    // awaiting approval
    resetStartCampaignResponses();
    document.querySelector('#startCampaign_info_response').style.display = '';
    document.querySelector('#startCampaign_info_response_body').innerHTML = `

    Your new StandardCampaign transaction is awaiting approval...

    `;

    // listen for service registered
    standardRefundCampaignFactoryContract.ServiceRegistered({}, function(serviceRegisteredError, serviceRegisteredResult){
      // service property
      const serviceAddress = serviceRegisteredResult.args._service;

      // check service registered owner property
      ownedContractFactory.at(serviceAddress).owner(function(ownerError, ownerAddress){
        // if the owner is the txObject from sender account, then this is the new campaign
        if (ownerAddress === txObject().from && serviceAddress !== emptyWeb3Address) {
          // send register tx
          campaignRegistry.register(serviceAddress, '', txObject(), function(registerCampaignError, registerCampaignTxHash){

            // handle register standard campaign error
            if (registerCampaignError) {
              resetStartCampaignResponses();
              document.querySelector('#startCampaign_warning_response').style.display = '';
              document.querySelector('#startCampaign_warning_response_body').innerHTML = `

              There was an error while registering your new campaign: ${JSON.stringify(registerCampaignError, null, 2)}

              `;
            }

            // reset dialogs
            resetStartCampaignResponses();
            document.querySelector('#startCampaign_info_response').style.display = '';
            document.querySelector('#startCampaign_info_response_body').innerHTML = `

            Your new WeiFund standard campaign contract was created at address:
            <br />
            ${serviceAddress}
            <br />
            <br />
            with transaction hash:
            <br />
            ${newCampaignTransactionHash} <a href="${etherScanTxHashUrl(newCampaignTransactionHash, getNetwork())}" target="_blank">etherscan</a>

            <br /><br />

            Registration Transaciton Hash:
            ${registerCampaignTxHash} <a href="${etherScanTxHashUrl(registerCampaignTxHash, getNetwork())}" target="_blank">etherscan</a>
            `;
          });
        } else {
          resetStartCampaignResponses();
          document.querySelector('#startCampaign_info_response').style.display = '';
          document.querySelector('#startCampaign_info_response').innerHTML = `

          Your WeiFund standard campaign is being created...
          <br />
          <br />
          Transaction Hash:
          <br />
          ${newCampaignTransactionHash} <a href="${etherScanTxHashUrl(newCampaignTransactionHash, getNetwork())}" target="_blank">etherscan</a>

          `;
        }
      });
    });

    // new standard campaign tx
    standardRefundCampaignFactoryContract.newStandardRefundCampaign(name, expiry, fundingGoal, beneficiary, txObject(), function(newStandardCampaignError, newStandardCampaignTxHash){
      // handle new standard campaign error
      if (newStandardCampaignError) {
        resetStartCampaignResponses();
        document.querySelector('#startCampaign_warning_response').style.display = '';
        document.querySelector('#startCampaign_warning_response_body').innerHTML = `

        There was an error while creating your new campaign: ${JSON.stringify(newStandardCampaignError, null, 2)}

        `;
      }

      // set new campagin tx hash
      newCampaignTransactionHash = newStandardCampaignTxHash;

      // handle new standard campaign error
      if (newCampaignTransactionHash) {
        resetStartCampaignResponses();
        document.querySelector('#startCampaign_info_response').style.display = '';
        document.querySelector('#startCampaign_info_response_body').innerHTML = `
        Your new campaign is being created...
        <br />
        <br />
        Transaction Hash:
        <br />
        ${newCampaignTransactionHash} <a href="${etherScanTxHashUrl(newCampaignTransactionHash, getNetwork())}" target="_blank">etherscan</a>

        `;
      }
    });
  }
};

// export start campaign module
module.exports = handleStartCampaign;
