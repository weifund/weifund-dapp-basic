// require environment
const web3 = require('./web3').web3;
const classes = require('./lib/classes.json');
const txObject = require('./environment').txObject;

// setup campaign and data registries
const staffPicksContractFactory = web3.eth.contract(JSON.parse(classes.StaffPicks.interface));
const standardCampaignContractFactory = web3.eth.contract(JSON.parse(classes.StandardCampaign.interface));
const campaignContractFactory = web3.eth.contract(JSON.parse(classes.Campaign.interface));
const tokenContractFactory = web3.eth.contract(JSON.parse(classes.Token.interface));
const ownedContractFactory = web3.eth.contract(JSON.parse(classes.Owner.interface));
const campaignRegistryFactory = web3.eth.contract(JSON.parse(classes.CampaignRegistry.interface));
const campaignDataRegistryFactory = web3.eth.contract(JSON.parse(classes.CampaignDataRegistry.interface));
const standardRefundCampaignFactory = web3.eth.contract(JSON.parse(classes.StandardRefundCampaignFactory.interface));

// Contract Instances
const campaignRegistryContract = campaignRegistryFactory.at('0x93700217d32474d1637b4ddd04eb67b6adecf01a');
const campaignDataRegistryContract = campaignDataRegistryFactory.at('0x51ec7392def0584ccfd5ff29f35c0d286ad0373d');
const staffPicksContract = staffPicksContractFactory.at('0x2de8ffc2a818f375669a0bf178cb4f6a89da597b');
const standardRefundCampaignFactoryContract = standardRefundCampaignFactory.at('0xffb9adf430ed7a2d535eb3bd40981f1d8367bb8c');

// export contracts
module.exports = {
  classes: classes,
  standardRefundCampaignFactoryContract: standardRefundCampaignFactoryContract,
  standardRefundCampaignFactory: standardRefundCampaignFactory,
  campaignContractFactory: campaignContractFactory,
  tokenContractFactory: tokenContractFactory,
  ownedContractFactory: ownedContractFactory,
  campaignRegistryContract: campaignRegistryContract,
  staffPicksContract: staffPicksContract,
  campaignDataRegistryContract: campaignDataRegistryContract,
};
