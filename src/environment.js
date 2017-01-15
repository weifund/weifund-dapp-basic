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
export function getTransactions() {
  return personalTransactions;
}

// transactions
export function setTransaction(transactionId, transactionHash) {
  personalTransactions[transactionId] = transactionHash;
}

// set default account
export function setDefaultAccount(account) {
  defaultAccount = account;
}

// get default account
export function getDefaultAccount() {
  return defaultAccount;
}

// txObject builder
export function txObject() {
  return Object.assign({}, {
    from: getDefaultAccount(),
    gas: 3141592,
  });
}

// state related here
// this and locale will be localstore
// environment
export function getNetwork(){
  return 'testnet'; // or livenet
}

// get current locale
export function getLocale() {
  return store.get('locale') || 'en';
}

// set locale
export function setLocale(locale) {
  store.set('locale', locale);
}

// get contract environment
export function getContractEnvironment() {
  return 'ropsten';
}

// get all campaigns
export function getStoredCampaigns() {
  return campaigns;
}

// get single campaign
export function getCampaign(campaignId) {
  return campaigns[parseInt(campaignId, 10)];
}

// set campaign data
export function setCampaign(campaignId, campaignData) {
  campaigns[parseInt(campaignId, 10)] = campaignData;
}
