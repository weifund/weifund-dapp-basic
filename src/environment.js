// this manages the app environment
// including app state etc
// the goal being to make the app fairly stupid
// state variables

// localstore
import store from 'store';

// loaded campaigns
var campaigns = [];

// receipts
var transactions = [];

// default account
var defaultAccount = '';

// get transactions
function getTransactions() {
  return personalTransactions;
}

// transactions
function setTransaction(transactionId, transactionHash) {
  personalTransactions[transactionId] = transactionHash;
}

// set default account
function setDefaultAccount(account) {
  defaultAccount = account;
}

// get default account
function getDefaultAccount() {
  return defaultAccount;
}

// txObject builder
function txObject() {
  return Object.assign({}, {
    from: getDefaultAccount(),
    gas: 3141592,
  });
}

// state related here
// this and locale will be localstore
// environment
function getNetwork(){
  return 'testnet'; // or livenet
}

// get current locale
function getLocale() {
  return store.get('locale') || 'en';
}

// set locale
function setLocale(locale) {
  store.set('locale', locale);
}

// get contract environment
function getContractEnvironment() {
  return 'ropsten';
}

// get all campaigns
function getStoredCampaigns() {
  return campaigns;
}

// get single campaign
function getCampaign(campaignId) {
  return campaigns[parseInt(campaignId, 10)];
}

// set campaign data
function setCampaign(campaignId, campaignData) {
  campaigns[parseInt(campaignId, 10)] = campaignData;
}

// export campaign
module.exports = {
  getDefaultAccount,
  getContractEnvironment,
  setDefaultAccount,
  txObject,
  campaigns,
  getStoredCampaigns,
  getCampaign,
  setCampaign,
  getNetwork,
  getLocale,
  setLocale,
  setTransaction,
  getTransactions,
};
