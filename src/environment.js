// this manages the app environment
// including app state etc
// the goal being to make the app fairly stupid
// state variables

// loaded campaigns
var campaigns = [];

// receipts
var transactions = [];

// default account
var defaultAccount = '';

// get transactions
const getTransactions = function() {
  return personalTransactions;
};

// transactions
const setTransaction = function(transactionId, transactionHash) {
  personalTransactions[transactionId] = transactionHash;
};

// set default account
const setDefaultAccount = function(account) {
  defaultAccount = account;
};

// get default account
const getDefaultAccount = function() {
  return defaultAccount;
};

// txObject builder
const txObject = function() {
  return {
    from: defaultAccount,
    gas: 3141592,
  };
};

// state related here
// this and locale will be localstore
// environment
const getNetwork = function(){
  return 'testnet'; // or livenet
};

// get current locale
const getLocale = function() {
  return 'en';
};

// get contract environment
const getContractEnvironment = function() {
  return 'morden';
};

// get all campaigns
const getCampaigns = function() {
  return campaigns;
};

// get single campaign
const getCampaign = function(campaignId) {
  return campaigns[parseInt(campaignId)];
};

// set campaign data
const setCampaign = function(campaignId, campaignData) {
  campaigns[parseInt(campaignId)] = campaignData;
};

// export campaign
module.exports = {
  getDefaultAccount: getDefaultAccount,
  getContractEnvironment: getContractEnvironment,
  setDefaultAccount: setDefaultAccount,
  txObject: txObject,
  campaigns: campaigns,
  getCampaigns: getCampaigns,
  getCampaign: getCampaign,
  setCampaign: setCampaign,
  getNetwork: getNetwork,
  getLocale: getLocale,
  setTransaction: setTransaction,
  getTransactions: getTransactions,
};
