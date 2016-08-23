// load web3 and campaign registry contract
const web3 = require('../web3').web3;
const campaignRegistryContract = require('../contracts').campaignRegistryContract;
const filterXSSObject = require('../utils/').filterXSSObject;

/*
Example Use:
// load transaciton test
loadTransaction('0xdac1f3420d7a3dfc400ef180fb9e357ce5fe7a0e96ecbae5ac85aef2e2fa06e3', function(err, result){
  console.log('tx', err, result);
});
*/

// load transaction method
const loadTransaction = function(txHash, callback) {
  var transactionObject = {
    transactionHash: txHash,
    startLoadTime: Math.round((new Date()).getTime() / 1000),
    endLoadTime: 0,
    timeToLoad: 0,
    isCampaignTransaction: false,
    campaignId: null,
    campaignAddress: '0x',
    receipt: {},
  };

  // get transaction receipt
  web3.eth.getTransactionReceipt(txHash, function(txReceiptError, txReceiptResult){
    // handle error
    if (txReceiptError) {
      return callback(txReceiptError, null);
    }

    // set transaction receipt result
    transactionObject.receipt = txReceiptResult;

    // get id of campaign
    campaignRegistryContract.idOf(txReceiptResult.to, function(campaignIdError, campaignIdResult){
      // handle error
      if (campaignIdError) {
        return callback(campaignIdError, null);
      }

      // get address to confirm transaction was to a campaign
      campaignRegistryContract.addressOf(campaignIdResult, function(campaignAddressError, campaignAddressResult){
        // handle error
        if (campaignAddressError) {
          return callback(campaignAddressError, null);
        }

        // if address on registry, matches address on receipt, add to tx object
        if (campaignAddressResult === txReceiptResult.to) {
          // set campaign ID if any
          transactionObject.campaignId = campaignIdResult;
          transactionObject.isCampaignTransaction = true;
          transactionObject.campaignAddress = campaignAddressResult;
        }

        // set end load time
        transactionObject.endLoadTime = Math.round((new Date()).getTime() / 1000);
        transactionObject.timeToLoad = transactionObject.endLoadTime - transactionObject.startLoadTime;

        // fire final callback
        callback(null, filterXSSObject(transactionObject));
      });
    });
  });
};

// export method
module.exports = loadTransaction;
