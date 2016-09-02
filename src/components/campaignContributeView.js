const campaignContributeQR = require('./campaignContributeQR');
const campaignContributeReceipt = require('./campaignContributeReceipt');
const campaignContributeForm = require('./campaignContributeForm');
const campaignContributeReview = require('./campaignContributeReview');
const campaignContributeNav = require('./campaignContributeNav');

const campaignContributeView = function(options) {
  const campaignObject = options.campaignObject;
  return `<div id="campaign-contribute" style="margin-top: 40px; margin-bottom: 150px;">

  <input type="hidden" value="${campaignObject.id}" id="campaign_id" />

  <div class="row center-block container text-center" style="margin-bottom: 60px;">
    <a href="/campaign/${campaignObject.id}/" target="_blank" style="color: #333; text-decoration: none;">
      <h1 class="text-pretty-huge">${campaignObject.name}</h1>
    </a>
    <h4>by ${campaignObject.owner}</h4>
  </div>

  <div id="view-campaign-contribute-method" class="row center-block container" style="display: none;">
    <!--<div class="row">
      <div class="col-xs-12">
        <h3>Warning</h3>
        <h4>This is experimental software. Please ensure your device, browser and wallets are secure.</h4>
      </div>
    </div>

    <br />-->

    <div class="row col-xs-12">
      <div class="col-xs-12">
        <h3>Select Contribution Method</h3>
        <br />
        <div class="row checkbox-list-wrapper">
          <div class="col-xs-12">
            <a href="/campaign/${campaignObject.id}/contribute/ether" class="checkbox" style="text-decoration: none; cursor: pointer; color: #333;">
              <h4><input type="checkbox">Ether (ETH)</h4>
            </a>
            <br />
            <a href="/campaign/${campaignObject.id}/contribute/cryptocurrency" class="checkbox" style="text-decoration: none; cursor: pointer; color: #333;">
              <h4><input type="checkbox">Bitcoin</h4>
            </a>
            <br />
            <a href="/campaign/${campaignObject.id}/contribute/cryptocurrency" class="checkbox" style="text-decoration: none; cursor: pointer; color: #333;">
              <h4><input type="checkbox">Other cryptocurrencies</h4>
            </a>
            <br />
            <a href="/campaign/${campaignObject.id}/contribute/exchanges" class="checkbox" style="text-decoration: none; cursor: pointer; color: #333;">
              <h4><input type="checkbox">USD or other currencies</h4>
            </a>
          </div>
        </div>
        <br />
        <h4>Please select the method in which you will contribute to this campaign</h4>
      </div>
    </div>
    ${campaignContributeNav({backURL: `/campaign/${options.campaignObject.id}/`, showNextButton: false})}
  </div>

  <div id="view-campaign-contribute-wallet" class="row center-block container" style="margin-top: 40px; display: none;">
    <div class="col-xs-12">
      <h3>No Address Found</h3>
      <br />
      <h4>Looks like you dont have any Ethereum wallet, create one, by using one of these tools.</h4>
      <br />
      <div class="row">
        <div class="col-xs-12 bg-white">
          <h3>Wallet Options</h3>
          <br />
          <ul class="list-group list-inline list-group-naked">
            <li class="list-group-item">
              <a href="https://github.com/ethereum/mist/releases" target="_blank">
                <button class="btn btn-primary btn-lg">Mist* Browser</button>
              </a>
            </li>
            <li class="list-group-item">
              <a href="https://metamask.io/" target="_blank">
                <button class="btn btn-primary btn-lg">MetaMask</button>
              </a>
            </li>
            <li class="list-group-item">
              <a href="https://ethcore.io/parity.html" target="_blank">
                <button class="btn btn-primary btn-lg">Parity</button>
              </a>
            </li>
          </ul>
          <br />
          <br />
          <h4>Here are some Ethereum wallet options. Note, if you feel these links are not correct or compromised, stop using this service immediatly, and report it to mail@weifund.io.</h4>
        </div>
      </div>
    </div>
    ${campaignContributeNav({backURL: `/campaign/${options.campaignObject.id}/contribute`, showNextButton: false})}
  </div>

  <div id="view-campaign-contribute-exchanges" class="row center-block container" style="margin-top: 40px; display: none;">
    <div class="col-xs-12">
      <h3>Get Ether by Exchange</h3>
      <br />
      <h4>Please use one of these exchange options to exchange currency to Ether.</h4>
      <br />
      <div class="row">
        <div class="col-xs-12 bg-white">
          <h3>Exchange Options</h3>
          <br />
          <ul class="list-group list-inline list-group-naked">
            <li class="list-group-item">
              <a href="https://www.kraken.com/" target="_blank">
                <button class="btn btn-primary btn-lg">Kraken</button>
              </a>
            </li>
            <li class="list-group-item">
              <a href="https://www.quadrigacx.com/" target="_blank">
                <button class="btn btn-primary btn-lg">Quadrigacx</button>
              </a>
            </li>
            <li class="list-group-item">
              <a href="https://poloniex.com/" target="_blank">
                <button class="btn btn-primary btn-lg">Poloniex</button>
              </a>
            </li>
            <li class="list-group-item">
              <a href="https://www.chbtc.com/" target="_blank">
                <button class="btn btn-primary btn-lg">CHBTC</button>
              </a>
            </li>
          </ul>
          <br />
          <br />
          <h4>Here are some Ethereum exchange options. Note, if you feel these links are compromised or not correct, stop using this service immediatly, and report it to mail@weifund.io.</h4>
        </div>
      </div>
    </div>
    ${campaignContributeNav({backURL: `/campaign/${options.campaignObject.id}/contribute`, showNextButton: false})}
  </div>

  <div id="view-campaign-contribute-ether-method" class="row center-block container" style="margin-top: 40px; display: none;">
    <div class="col-xs-12">
      <h3>Select Contribution Method</h3>
      <br />
      <div class="row checkbox-list-wrapper">
        <div class="col-xs-12">
          <a href="/campaign/${campaignObject.id}/contribute/ether-qrcode" class="checkbox" style="text-decoration: none; cursor: pointer; color: #333;">
            <h4><input type="checkbox">QR Code</h4>
          </a>
          <br />
          <a href="/campaign/${campaignObject.id}/contribute/form" class="checkbox" style="text-decoration: none; cursor: pointer; color: #333;">
            <h4><input type="checkbox">Our Interface</h4>
          </a>
        </div>
      </div>
      <br />
      <h4>Please select the method in which you will contribute Ether to this campaign</h4>
    </div>
    ${campaignContributeNav({backURL: `/campaign/${options.campaignObject.id}/contribute`, showNextButton: false})}
  </div>

  <div id="view-campaign-contribute-cryptocurrency-method" class="row center-block container" style="margin-top: 40px; display: none;">
    <div class="col-xs-12">
      <h3>Select Contribution Method</h3>
      <br />
      <div class="row checkbox-list-wrapper">
        <div class="col-xs-12">
          <div class="checkbox">
            <h4><input type="checkbox">via ShapeShift to your Ether address</h4>
          </div>
          <br />
          <a href="/campaign/${campaignObject.id}/contribute/exchanges" class="checkbox" style="text-decoration: none; cursor: pointer; color: #333;">
            <h4><input type="checkbox">Exchange to your Ether address</h4>
          </a>
        </div>
      </div>
      <br />
      <h4>Please select a Bitcoin payment method, either by ShapeShifting to the provided Ether address or using an exchange and widthrawing to your provided ether address.</h4>
      <br />
      <h3>Your Ethereum Address</h3>
      <h2>${options.defaultAccount()}</h2>
      <br />
      <h4>Please verify that this is your Ethereum address and you have access and control over it before sending Ether (ETH) to it.</h4>
      <br /><br />
    </div>
    ${campaignContributeNav({backURL: `/campaign/${options.campaignObject.id}/contribute`, showNextButton: false})}
  </div>

  ${campaignContributeQR({campaignObject: options.campaignObject, getLocale: options.getLocale})}

  ${campaignContributeForm({campaignObject: options.campaignObject, getLocale: options.getLocale, defaultAccount: options.defaultAccount, web3: options.web3})}

  ${campaignContributeReview({campaignObject: options.campaignObject, getLocale: options.getLocale, defaultAccount: options.defaultAccount, web3: options.web3})}

  <div id="view-campaign-contribute-receipt"></div>
`;
};

module.exports = campaignContributeView;
