// utils
import { log, etherScanAddressUrl, etherScanTxHashUrl } from 'weifund-util';

// document helper
import { el } from '../document';

// require components
import components from '../components';

// environment
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';

// web3
import { web3 } from '../web3';
import { ipfs } from '../ipfs';

// require contracts
// setup campaign and data registries
// Campaign/token contracts
import Contracts from 'weifund-contracts';
const contracts = new Contracts('ropsten', web3.currentProvider);
const campaignRegistry = contracts.CampaignRegistry.instance();
const campaignDataRegistry = contracts.CampaignDataRegistry.instance();
const standardCampaignFactory = contracts.StandardCampaign.factory;
const campaign = contracts.Campaign.factory;

// router
import { refreshPageButtons } from '../router';

// require i18n
import { t } from '../i18n';

// export method
module.exports = handleCampaignDataRegistration;

// register campaign data
function handleCampaignDataRegistrationRaw(campaignAddress, ipfsHash){
  const ipfsHashHex = ipfs.utils.base58ToHex(ipfsHash);
  const ipfsHashBytecode = `0x${ipfsHashHex}`;

  // register data with data registry
  campaignDataRegistry.register(campaignAddress, ipfsHashBytecode, txObject(), function(registerDataError, registerDataResult){
    //log('Reg', registerDataError, registerDataResult);
  });
}

// register campaign data
function handleCampaignDataRegistration(){
  const campaignAddress = el('#registerCampaignData_campaign').value;
  const ipfsHash = el('#registerCampaignData_ipfsHash').value;
  const ipfsHashHex = ipfs.utils.base58ToHex(ipfsHash);
  const ipfsHashBytecode = `0x${ipfsHashHex}`;

  // register data with data registry
  campaignDataRegistry.register(campaignAddress, ipfsHashBytecode, txObject(), function(registerDataError, registerDataResult){
    log('Reg', registerDataError, registerDataResult);
  });
}
