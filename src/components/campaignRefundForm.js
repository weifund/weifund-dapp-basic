import methodABIInputsForm from './methodABIInputsForm';

// export method
module.exports = campaignRefundForm;

// main export
function campaignRefundForm(options) {
  const campaignObject = options.campaignObject;
  const defaultAccount = options.defaultAccount;
  const t = options.t;

  return `
  <div id="view-campaign-refund-form" class="row center-block container" style="margin-top: 80px; margin-bottom: 150px; display: none;">

    <div class="row center-block container">
      <input type="hidden" value="${campaignObject.id}" id="campaign_id" />

      <div class="row center-block container text-center" style="margin-bottom: 60px;">
        <a href="/campaign/${campaignObject.id}/" target="_blank" style="color: #333; text-decoration: none;">
          <h1 class="text-pretty-huge">${campaignObject.name}</h1>
        </a>
        <h4>by ${campaignObject.owner}</h4>
      </div>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-8 no-border-xs no-border-sm" style="border-right: 3px solid #E1E1E1; padding-right: 50px;">
      <!--
      <h3>Contribution Amount</h3>
      <h4>Please select the amount you want to contribute to this campaign.</h4>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <div class="input-slider input-slider-lg" data-input-id="campaign_contributeAmount">
            <div class="input-slider-rail">
              <div class="input-slider-rail-highlight"></div>
              <div class="input-slider-bar"></div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <div class="input-group">
            <input type="text" id="campaign_contributeAmount" value="1.5" class="form-control input-lg" placeholder="i.e. 1" aria-describedby="basic-addon2" />
            <span class="input-group-addon" id="basic-addon2">ether</span>
          </div>
        </div>
      </div> -->

      <div id="campaignContribution_inputs">
        ${methodABIInputsForm({campaignObject: campaignObject, methodType: 'refund'})}
      </div>

      <br />

      <h3>Support WeiFund</h3>
      <h4>Help support WeiFund by making a small donation to the team.</h4>
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-8">
          <div class="input-slider input-slider-lg" data-input-id="campaign_weifundContributeAmount">
            <div class="input-slider-rail">
              <div class="input-slider-rail-highlight"></div>
              <div class="input-slider-bar"></div>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4">
          <div class="input-group">
            <input type="text" id="campaign_weifundContributeAmount" value=".03" class="form-control input-lg" placeholder="i.e. 3" aria-describedby="basic-addon2" />
            <span class="input-group-addon" id="basic-addon2">ether</span>
          </div>

        </div>
      </div>

      <small>Note, this will create a small second transaction. We thank for your support.</small>

      <br /><br />

      <h3>Disclaimer</h3>
      <p>You must read and agree to this disclaimer before contributing to this campaign.</p>
      <textarea class="form-control input-lg text-uppercase">Disclaimer

The data displayed in the Public Data tool is provided by the third party indicated as the data source. WeiFund does not create this data, vouch for its accuracy, or guarantee that it is the most recent data available from the data provider. For many or all of the data, the data is by its nature approximate and will contain some inaccuracies. The data may contain errors introduced by the data provider(s) and/or by WeiFund. The names of countries and other territories shown in the tool may differ from those in the original data.

WeiFund (A) expressly disclaims the accuracy, adequacy, or completeness of any data and (B) shall not be liable for any errors, omissions or other defects in, delays or interruptions in such data, or for any actions taken in reliance thereon. Neither WeiFund nor any of its data providers will be liable for any damages relating to your use of the data provided herein.
      </textarea>
      <br />
      <input type="checkbox" id="campaign-contribute-disclaimer" placeholder="i.e. 400" />
      By checking this box, you agree to the WeiFund disclaimer.
      <br />
      <br />
      <br />
      <br />
      <a href="/campaign/${campaignObject.id}/refund/review" id="campaign-contribute-review-button" class="btn btn-primary btn-lg">Review Refund</a>
      <br /><br />
      <div id="campaign-contribute-form-response-wrapper" class="alert alert-dismissible alert-warning" style="display: none;">
        <h4>Warning!</h4>
        <p id="campaign-contribute-form-response-body">Best check yo self, you're not looking too good. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, <a href="#" class="alert-link">vel scelerisque nisl consectetur et</a>.</p>
      </div>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 no-padding-xs text-break-all" style="padding-left: 50px;">
      <h3>Technical Details</h3>
      <br />
      <h4>Network</h4>
      <h5>Ethereum (ETH) Live Network*</h5>
      <br />
      <h4>Selected Account</h4>
      <h5>${defaultAccount()}</h5>
      <br />
      <h4>Selected Account Balance</h4>
      <h5>30 Ether (ETH)</h5>
      <br />
      <h4>Contract Address</h4>
      <h5>${campaignObject.addr}</h5>
      <br />
      <h4>Contract ABI</h4>
      <pre style="height: 150px; overflow: scroll;">${JSON.stringify(campaignObject.abi, null, 2)}</pre>
      <br />
      <h4>Contribute Method ABI</h4>
      <h5>${campaignObject.refundMethodABI}</h5>
      <br />
      <h4>Web3 Provider</h4>
      <h5>--</h5>
    </div>
  </div>`;
}
