// utils
const utils = require('../utils/');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;
const oneDay = utils.oneDay;

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
const campaignRegistry = contracts.campaignRegistryContract;
const campaign = contracts.campaignContractFactory;

// router instance
var router = require('../router');
const getRouter = router.getRouter;

// require i18n
const t = require('../i18n').t;

// handle a campaign contribution
const handleCampaignContribution = function(event){
  // get contribution value, and convert
  const selectedCampaignIdInput = parseInt(document.querySelector('#campaign_id').value);
  const selectedCampaign = getCampaign(selectedCampaignIdInput);
  const contributeValueInput =  document.querySelector('#campaign_contributeAmount').value;
  const contributeValueWei = web3.toWei(contributeValueInput, 'ether');
  const campaignContractFactory = web3.eth.contract(selectedCampaign.abi);
  const campaignContractInstance = campaignContractFactory.at(selectedCampaign.addr);
  const contributeMethodName = selectedCampaign.contributeMethodABIObject.name;
  const contributeMethodInputParams = selectedCampaign.contributeMethodABIObject.inputs;
  const numContributeMethodInputParams = selectedCampaign.contributeMethodABIObject.inputs.length;
  const contributionIntervalTimeout = 180000; // 15 seconds
  const contributionReceiptIntervalLength = 1000;
  var contributionIntervalTimer = 0;
  var contributionParams = [];

  // contribute to weifund
  const weifundContributionAmount = document.querySelector('#campaign_weifundContributeAmount').value;
  const weifundContributionAmountFloat = parseFloat(weifundContributionAmount);
  const weifundContributionAmountEther = web3.toWei(weifundContributionAmount, 'ether');

  // handle additional contribution inputs
  if (numContributeMethodInputParams > 0) {
    contributeMethodInputParams.forEach(function(inputParam, inputParamIndex) {
        // get input type and value
        const inputType = inputParam.type;
        const inputValue = document.querySelector(`#campaign_contributionInput_${inputParamIndex}`).value;

        // handle contribute input data
        // bool to parseInt, everything else as a string
        if (inputType.indexOf('bool') !== -1) {
          contributionParams.push(parseInt(inputValue));
        } else {
          contributionParams.push(inputValue);
        }
    });
  }

  // confirmation message
  const confirmationMessage = `Contribution Confirmation:

Are you sure you want to contribute ${web3.fromWei(contributeValueWei, 'ether')} ether to the "${selectedCampaign.name}" campaign and make a second donation transaction of ${web3.fromWei(weifundContributionAmountEther, 'ether')} ether to WeiFund?
  `;

  // reset review responses
  const resetReviewResponses = function () {
    document.querySelector('#campaign_contribute_info_response').style.display = 'none';
    document.querySelector('#campaign_contribute_warning_response').style.display = 'none';
  }

  // contribute to campaign instance
  if (confirm(confirmationMessage)) {
    // awaiting tx approval message
    resetReviewResponses();
    document.querySelector('#campaign_contribute_info_response').style.display = '';
    document.querySelector('#campaign_contribute_info_response').innerHTML = `Your contribution transaction is awaiting approval...`;

    // build contribute params
    contributionParams.push(Object.assign({value: contributeValueWei}, txObject()));
    contributionParams.push(function(contributeError, contributeResultTxHash){
      if (contributeError) {
        resetReviewResponses();
        document.querySelector('#campaign_contribute_warning_response').style.display = '';
        document.querySelector('#campaign_contribute_warning_response').innerHTML = `There was an error while sending your contribution transaction: ${String(JSON.stringify(contributeError, null, 2))}`;
      }

      // if tx hash present
      if (contributeResultTxHash) {
        resetReviewResponses();
        document.querySelector('#campaign_contribute_info_response').style.display = '';
        document.querySelector('#campaign_contribute_info_response').innerHTML = `
        Your contribution transaction is processing with transaction hash:

        ${contributeResultTxHash}

        -- checkout on <a target="_blank" href="${etherScanTxHashUrl(contributeResultTxHash, getNetwork())}">etherscan</a>`;
      }

      // check transaction receipt
      const receiptInterval = setInterval(function(){
        web3.eth.getTransactionReceipt(contributeResultTxHash, function(receiptError, receiptResult){
          if (receiptError) {
            resetReviewResponses();
            document.querySelector('#campaign_contribute_warning_response').style.display = '';
            document.querySelector('#campaign_contribute_warning_response').innerHTML = `There was an error while getting your transaction receipt: ${String(JSON.stringify(receiptError, null, 2))} with transaction hash: ${contributeResultTxHash}`;

            // clear receipt interval
            clearInterval(receiptInterval);
          }

          // display transaction receipt
          if (receiptResult) {
            resetReviewResponses();
            document.querySelector('#campaign_contribute_info_response').style.display = '';
            document.querySelector('#campaign_contribute_info_response').innerHTML = `Your transaction was processed: ${JSON.stringify(receiptResult, null, 2)} with transaction hash: ${contributeResultTxHash}`;

            document.querySelector('#view-campaign-contribute-receipt').innerHTML = components.campaignContributeReceipt({receipt: receiptResult, campaignObject: selectedCampaign, getLocale: getLocale, web3: web3});

            // clear receipt interval
            clearInterval(receiptInterval);

            // receipt page
            getRouter()(`/campaign/${selectedCampaign.id}/contribute/receipt`);
          }
        });

        // up timer by 1 second
        contributionIntervalTimer += contributionReceiptIntervalLength;

        // if interval checking expires
        if (contributionIntervalTimer >= contributionIntervalTimeout) {
          resetReviewResponses();
          document.querySelector('#campaign_contribute_warning_response').style.display = '';
          document.querySelector('#campaign_contribute_warning_response').innerHTML = `Contribution transaction checking timed out with transaction hash: ${contributeResultTxHash}. Your contribution either did not process or is taking a very long time to mine.. Receipt interval polling has stopped.`;

          // clear receipt interval
          clearInterval(receiptInterval);
        }
      }, contributionReceiptIntervalLength);
    });

    // send weifund tx
    if (parseFloat(weifundContributionAmount) > 0) {
      web3.eth.sendTransaction(Object.assign({value: weifundContributionAmountEther}, txObject()), function(weifundContributionError, weifundContributionTxHash){
        console.log('WeiFund contribution', weifundContributionError, weifundContributionTxHash);
      });
    }

    // contribute to campaign
    campaignContractInstance[contributeMethodName].apply(campaignContractInstance, contributionParams);
  }
};

module.exports = handleCampaignContribution;
