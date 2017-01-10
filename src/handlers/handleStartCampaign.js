// utils
import { log, etherScanAddressUrl, etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';

// document helper
import { el } from '../document';

// environment and components
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';
import components from '../components';

// web3
import { web3 } from '../web3';

// require contracts
import Contracts from 'weifund-contracts';
const contracts = new Contracts('ropsten', web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();
const campaign = contracts.Campaign.factory;
const ownedContractFactory = contracts.Owned.factory;
const standardCampaignContractFactory = contracts.StandardCampaign.factory;
const standardCampaignFactory = contracts.StandardCampaignFactory.instance();

// router instance
import { getRouter, refreshPageButtons } from '../router';

// require i18n
import { t } from '../i18n';

// reset responses
const resetStartCampaignResponses = function() {
  el('#startCampaign_info_response').style.display = 'none';
  el('#startCampaign_warning_response').style.display = 'none';
};

// handle new campaign creation
const handleStartCampaign = function(event){
  var newCampaignTransactionHash = '';

  const name = el('#startCampaign_name').value;
  const beneficiary = el('#startCampaign_beneficiary').value;
  const expiry = Math.round((new Date()).getTime() / 1000) + (parseInt(el('#startCampaign_expiry').value) * 86400, 10);
  const fundingGoal = web3.toWei(el('#startCampaign_fundingGoal').value, 'ether');
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
    el('#startCampaign_info_response').style.display = '';
    el('#startCampaign_info_response_body').innerHTML = `

    Your new StandardCampaign transaction is awaiting approval...

    `;

    // listen for service registered
    standardCampaignFactory.ServiceRegistered({}, function(serviceRegisteredError, serviceRegisteredResult){
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
              el('#startCampaign_warning_response').style.display = '';
              el('#startCampaign_warning_response_body').innerHTML = `

              There was an error while registering your new campaign: ${JSON.stringify(registerCampaignError, null, 2)}

              `;
            }

            // reset dialogs
            resetStartCampaignResponses();
            el('#startCampaign_info_response').style.display = '';
            el('#startCampaign_info_response_body').innerHTML = `

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
          el('#startCampaign_info_response').style.display = '';
          el('#startCampaign_info_response').innerHTML = `

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
    standardCampaignFactory.newStandardCampaign(name, expiry, fundingGoal, beneficiary, txObject(), function(newStandardCampaignError, newStandardCampaignTxHash){
      // handle new standard campaign error
      if (newStandardCampaignError) {
        resetStartCampaignResponses();
        el('#startCampaign_warning_response').style.display = '';
        el('#startCampaign_warning_response_body').innerHTML = `

        There was an error while creating your new campaign: ${JSON.stringify(newStandardCampaignError, null, 2)}

        `;
      }

      // set new campagin tx hash
      newCampaignTransactionHash = newStandardCampaignTxHash;

      // handle new standard campaign error
      if (newCampaignTransactionHash) {
        resetStartCampaignResponses();
        el('#startCampaign_info_response').style.display = '';
        el('#startCampaign_info_response_body').innerHTML = `
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
