// utils
const utils = require('../utils');
const emptyWeb3Address = utils.emptyWeb3Address;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('../contracts');
const campaignRegistry = contracts.campaignRegistryContract;

// get data methods
const getCampaignContractData = require('./getCampaignContractData');
const getCampaignInterfaceContractData = require('./getCampaignInterfaceContractData');
const getCampaignBeneficiaryData = require('./getCampaignBeneficiaryData');
const getCampaignIPFSData = require('./getCampaignIPFSData');
const parseCampaignDataObject = require('./parseCampaignDataObject');

// default campaign data structure
const defaultCampaignData = require('./defaultCampaignData.json');

// load campaign
const getCampaign = function(campaignID, callback) {

  // load campaign information from registry
  campaignRegistry.campaigns(parseInt(campaignID), function(campaignRegistryError, campaignRegistryResult){
    // handle campaign contract data error
    if (campaignRegistryError) {
      return callback(campaignRegistryError, null);
    }

    // campaign address
    const campaignAddress = campaignRegistryResult[0];

    // campaign address
    if (campaignAddress === emptyWeb3Address || campaignAddress === '0x') {
      return callback(`Invalid campaign ID or address. No campaign is registered under that address..`, null);
    }

    // get campaign contract data
    getCampaignContractData(campaignAddress, function(campaignDataError, campaignDataResult){
      // handle campaign contract data error
      if (campaignDataError) {
        return callback(campaignDataError, null);
      }

      // get campaign interface data
      getCampaignInterfaceContractData(campaignDataResult.interface, function(interfaceError, interfaceDataResult){
        // handle campaign contract data error
        if (interfaceError) {
          return callback(interfaceError, null);
        }

        // get campaign beneficiary data
        getCampaignBeneficiaryData(interfaceDataResult.beneficiary, function(beneficiaryError, beneficiaryResult){
          // handle campaign contract data error
          if (beneficiaryError) {
            return callback(beneficiaryError, null);
          }

          // get campaign ipfs data
          getCampaignIPFSData(campaignDataResult.registeredData, function(ipfsError, ipfsResult){
            // handle campaign contract data error
            if (ipfsError) {
              return callback(ipfsError, null);
            }

            // main campaign object
            const campaignDataObject = parseCampaignDataObject(Object.assign({},
              campaignDataResult,
              interfaceDataResult,
              beneficiaryResult,
              ipfsResult));

            // fire final callback
            callback(null, campaignDataObject);
          });
        });
      });
    });
  });
};

// export
module.exports = getCampaign;
