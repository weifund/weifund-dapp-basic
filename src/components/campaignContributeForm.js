const campaignContributeForm = function(options) {
  return `<div id="view-campaign-contribute-form" class="row center-block container" style="margin-top: 80px; margin-bottom: 150px;">
    <div class="col-xs-12 col-sm-6 col-md-8 no-border-xs no-border-sm" style="border-right: 3px solid #E1E1E1; padding-right: 50px;">
      <h3>Contribution Amount</h3>
      <h4>Please select the amount you want to contribute to Gnosis.</h4>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <div class="input-slider input-slider-lg" data-input-id="contributionAmount">
            <div class="input-slider-rail">
              <div class="input-slider-rail-highlight"></div>
              <div class="input-slider-bar"></div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <input type="text" id="contributionAmount" class="form-control input-lg" placeholder="i.e. 1 ether" />
        </div>
      </div>

      <br />

      <h3>Founder Amount</h3>
      <h4>This is the founder amount, the amount of tokens you wish to issue to the founders of Gnosis.</h4>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <div class="input-slider input-slider-lg" data-input-id="campaign_input_1">
            <div class="input-slider-rail">
              <div class="input-slider-rail-highlight"></div>
              <div class="input-slider-bar"></div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <input type="text" id="campaign_input_1" class="form-control input-lg" placeholder="i.e. 400 Gnosis" />
        </div>
      </div>

      <br />

      <h3>Support WeiFund</h3>
      <h4>Help support WeiFund by making a small donation to the team.</h4>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <div class="input-slider input-slider-lg" data-input-id="campaign_weifundDonation">
            <div class="input-slider-rail">
              <div class="input-slider-rail-highlight"></div>
              <div class="input-slider-bar"></div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <input type="text" id="campaign_weifundDonation" class="form-control input-lg" placeholder="i.e. 3 ether" />
        </div>
      </div>

      <small>Note, this will create a small second transaction. We thank for your support.</small>

      <br /><br />

      <h3>Disclaimer</h3>
      <p>You must agree to this disclaimer before contributing to this campaign.</p>
      <textarea class="form-control input-lg text-uppercase">Disclaimer

The data displayed in the Public Data tool is provided by the third party indicated as the data source. Google does not create this data, vouch for its accuracy, or guarantee that it is the most recent data available from the data provider. For many or all of the data, the data is by its nature approximate and will contain some inaccuracies. The data may contain errors introduced by the data provider(s) and/or by Google. The names of countries and other territories shown in the tool may differ from those in the original data.

Google (A) expressly disclaims the accuracy, adequacy, or completeness of any data and (B) shall not be liable for any errors, omissions or other defects in, delays or interruptions in such data, or for any actions taken in reliance thereon. Neither Google nor any of its data providers will be liable for any damages relating to your use of the data provided herein.
      </textarea>
      <br />
      <input type="checkbox" id="campaign_input_1" placeholder="i.e. 400" />
      By checking this box, you agree to the WeiFund disclaimer.
      <br />
      <br />
      <br />
      <br />
      <button class="btn btn-primary btn-lg">Review Contribution</button>
      <br /><br />
      <div class="alert alert-dismissible alert-warning">
        <h4>Warning!</h4>
        <p>Best check yo self, you're not looking too good. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, <a href="#" class="alert-link">vel scelerisque nisl consectetur et</a>.</p>
      </div>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 no-padding-xs text-break-all" style="padding-left: 50px;">
      <h3>Technical Details</h3>
      <br />
      <h4>Network</h4>
      <h5>Ethereum (ETH) Live Network*</h5>
      <br />
      <h4>Selected Account</h4>
      <h5>0x8e6316f44baeeee5d41a1070516cc5fa47baf222</h5>
      <br />
      <h4>Selected Account Balance</h4>
      <h5>30 Ether (ETH)</h5>
      <br />
      <h4>Contract Address</h4>
      <h5>0x9e6316f44baeeee5d41a1070516cc5fa47baf227</h5>
      <br />
      <h4>Contract ABI</h4>
      <pre style="height: 150px; overflow: scroll;">[{
"type":"event",
"inputs": [{"name":"a","type":"uint256","indexed":true},{"name":"b","type":"bytes32","indexed":false}],
"name":"Event"
}, {
"type":"event",
"inputs": [{"name":"a","type":"uint256","indexed":true},{"name":"b","type":"bytes32","indexed":false}],
"name":"Event2"
}, {
"type":"event",
"inputs": [{"name":"a","type":"uint256","indexed":true},{"name":"b","type":"bytes32","indexed":false}],
"name":"Event2"
}, {
"type":"function",
"inputs": [{"name":"a","type":"uint256"}],
"name":"foo",
"outputs": []
}]</pre>
      <br />
      <h4>Contribute Method ABI</h4>
      <h5>fund(uint256 founderAmount):()</h5>
      <br />
      <h4>Web3 Provider</h4>
      <h5>MetaMask Provider</h5>
    </div>
  </div>`;
};

module.exports = campaignContributeForm;
