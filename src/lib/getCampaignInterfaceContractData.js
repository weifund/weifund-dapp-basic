// web3 instance and setup method
const web3 = require('../web3').web3;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('../contracts');
const campaign = contracts.campaignContractFactory;

// campaign interface properties
const campaignInterfaceProperties = [
  'amountRaised',
  'beneficiary',
  'contributeMethodABI',
  'expiry',
  'fundingGoal',
  'name',
  'payoutMethodABI',
  'refundMethodABI',
  'version',
];

// helper callback, get all basic campaign interface properties
const getCampaignInterfaceContractData = function(campaignInterfaceAddress, callback, __propertyToLoad, __campaignObject) {
  // campaign object
  if (typeof __campaignObject === 'undefined') {
    __campaignObject = {};
  }

  // property to load
  if (typeof __propertyToLoad === 'undefined') {
    __propertyToLoad = campaignInterfaceProperties[0];
  }

  // setup interface instance
  const interfaceInstance = campaign.at(campaignInterfaceAddress);

  // property index
  const propertyIndex = campaignInterfaceProperties.indexOf(__propertyToLoad);

  // load property
  interfaceInstance[__propertyToLoad](function(propertyError, propertyResult){
    // handle property load error
    if (propertyError) {
      return callback(propertyError, null);
    }

    // property
    __campaignObject[__propertyToLoad] = propertyResult;

    // if all properties loaded
    if (propertyIndex === campaignInterfaceProperties.length - 1) {
      callback(null, __campaignObject);
    } else {
      getCampaignInterfaceContractData(campaignInterfaceAddress,
        callback,
        campaignInterfaceProperties[propertyIndex + 1],
        __campaignObject);
    }
  });
};

module.exports = getCampaignInterfaceContractData;
