// web3 instance and setup method
const web3 = require('../web3').web3;

// get campaign beneficiary data
const getCampaignBeneficiaryData = function(beneficiaryAddress, callback){
  // setup data object
  const campaignDataObject = {
    beneficiaryContractCode: '0x',
  };

  // get beneficiary code
  web3.eth.getCode(beneficiaryAddress, function(beneficiaryContractCodeError, beneficiaryContractCode){
    // handle code error
    if (beneficiaryContractCodeError) {
      return callback(beneficiaryContractCodeError, null);
    }

    campaignDataObject.beneficiaryContractCode = beneficiaryContractCode;

    // fire final callback
    callback(null, campaignDataObject);
  });
};

// export beneficiary data function
module.exports = getCampaignBeneficiaryData;
