// utils
const utils = require('weifund-util');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;

// require components
const components = require('../components');

// environment
const environment = require('../environment');
const getNetwork = environment.getNetwork;
const getLocale = environment.getLocale;
const txObject = environment.txObject;
const getDefaultAccount = environment.getDefaultAccount;
const setDefaultAccount = environment.setDefaultAccount;

// campaign environment methods
const getCampaign = environment.getCampaign;
const setCampaign = environment.setCampaign;

// web3
const web3 = require('../web3').web3;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('weifund-contracts');
const classes = require('weifund-contracts').classes;
const campaignRegistry = contracts.CampaignRegistry(web3, getNetwork());
const staffPicks = contracts.StaffPicks(web3, getNetwork());
const campaignDataRegistry = contracts.CampaignDataRegistry(web3, getNetwork());
const standardCampaignFactory = contracts.factories.StandardCampaign(web3);
const campaign = contracts.factories.Campaign(web3);

// router
const refreshPageButtons = require('../router').refreshPageButtons;

// require i18n
const t = require('../i18n').t;

// register campaign data
const handleCampaignDataRegistration = function(){
  const campaignAddress = document.querySelector('#registerCampaignData_campaign').value;
  const ipfsHash = document.querySelector('#registerCampaignData_ipfsHash').value;
  const ipfsHashHex = ipfs.utils.base58ToHex(ipfsHash);
  const ipfsHashBytecode = `0x${ipfsHashHex}`;

  // register data with data registry
  campaignDataRegistry.register(campaignAddress, ipfsHashBytecode, function(registerDataError, registerDataResult){
    log('Reg', registerDataError, registerDataResult);
  });
};

module.exports = handleCampaignDataRegistration;
