// this manages the app environment
// including app state etc
// the goal being to make the app fairly stupid
// state variables

// localstore
import store from 'store';
import BigNumber from 'bignumber.js';

// loaded campaigns
let campaigns = [];

// receipts
let transactions = [];

// default account
let defaultAccount = '';

// default account balance
let accountBalance = new BigNumber(0);

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
    gas: 3000000,
  });
}

// state related here
// this and locale will be localstore
// environment
export function getNetwork(){
  return 'mainnet'; // or 'ropsten' or ''
}

// name for
export function nameOf(address) {
  const names = {
    '0x6023e44829921590b24f458c9ee4f544507d59b6': 'WeiFund Team',
  };
  return names[address.toLowerCase()] || address;
}

export function validCampaigns() {
  return [0, 1];
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
  return 'mainnet';
}

// get all campaigns
export function getStoredCampaigns() {
  return campaigns;
}

export function setAccountBalance(balance) {
  accountBalance = balance;
}

export function getAccountBalance() {
  return accountBalance;
}

// get single campaign
export function getCampaign(campaignId) {
  return campaigns[parseInt(campaignId, 10)];
}

// set campaign data
export function setCampaign(campaignId, campaignData) {
  campaigns[parseInt(campaignId, 10)] = campaignData;
}
