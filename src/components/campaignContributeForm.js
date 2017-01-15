import yo from 'yo-yo';

import campaignContributeNav from './campaignContributeNav';
import { getNetwork } from '../environment';

export default function campaignContributeForm(options) {
  const campaignObject = options.campaignObject;
  const defaultAccount = options.defaultAccount;
  const t = options.t;

  return yo`<div>
  <div id="view-campaign-contribute-form" class="row center-block container"
    style="margin-top: 80px; margin-bottom: 150px;">
    <div class="col-xs-12 col-sm-6 col-md-8 no-border-xs no-border-sm"
      style="border-right: 3px solid #E1E1E1; padding-right: 50px;">
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
          <div class="input-group" id="campaign_contributeAmountGroup">
            <input type="text" id="campaign_contributeAmount" value="1.5"
              class="form-control input-lg" placeholder="i.e. 1" aria-describedby="basic-addon2" />
            <span class="input-group-addon" id="basic-addon2">ether</span>
          </div>
        </div>
      </div>

      <input type="hidden" id="campaignFormID" value="${campaignObject.id}" />

      <div id="campaignContribution_inputs">
      </div>

      <br />

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
      <a href="/campaign/${campaignObject.id}/contribute/review"
        id="campaign-contribute-review-button" class="btn btn-primary btn-lg">
        Review Contribution
      </a>
      <br /><br />
      <div id="campaign-contribute-form-response-wrapper"
        class="alert alert-dismissible alert-warning" style="display: none;">
        <h4>Warning!</h4>
        <p id="campaign-contribute-form-response-body">
          Best check yo self, you're not looking too good. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, <a href="#" class="alert-link">vel scelerisque nisl consectetur et</a>.
        </p>
      </div>
    </div>
    <div class="col-xs-12 col-sm-6 col-md-4 no-padding-xs text-break-all"
      style="padding-left: 50px;">
      <h3>Technical Details</h3>
      <br />
      <h4>Network</h4>
      <h5>Ethereum (ETH) ${getNetwork()} Network*</h5>
      <br />
      <h4>Selected Account</h4>
      <h5 id="defaultAccountAddress">0x</h5>
      <br />
      <h4>Selected Account Balance</h4>
      <h5><span id="defaultAccountBalance">0</span> Ether (ETH)</h5>
      <br />
      <h4>Contract Address</h4>
      <h5>${campaignObject.addr}</h5>
      <br />
      <h4>Contract ABI</h4>
      <pre style="height: 150px; overflow: scroll;">${
        JSON.stringify(campaignObject.abi, null, 2)
      }</pre>
      <br />
      <h4>Contribute Method ABI</h4>
      <h5>${campaignObject.contributeMethodABI}</h5>
      <br />
      <h4>Provider</h4>
      <h5>Hooked Web3 Provider</h5>
    </div>
    ${campaignContributeNav({
      backURL: `/campaign/${options.campaignObject.id}/contribute/`,
      showNextButton: false,
    })}
  </div></div>`;
}
