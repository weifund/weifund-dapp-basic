import yo from 'yo-yo';
import campaignContributeNav from './campaignContributeNav';
import { web3 } from '../web3';

// main export
export default function campaignContributeReview(options) {
  const t = options.t;

  return yo`<div id="view-campaign-contribute-review"
    class="center-block container" style="display: none; margin-top: 40px; margin-bottom: 150px;">
    <div class="row">
      <div class="col-xs-12">
        <h3>Review Contribution
          <a href="javascript:window.print()">
            <button class="btn btn-sm text-gray" style="float: right;">
              Print
            </button>
          </a>
        </h3>
        <h4>Almost done! Please review your contribution information before proceeding.</h4>
        <br />
        <br />
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-sm-8">
        <h4>Campaign Contribution</h4>
        <h4>
          <b><span id="campaign_contributeReview_contributeAmount">0</span> Ether</b>
          <small>(ETH)</small>
        </h4>

        <br /><br />

        <h4>Approx. Gas Cost</h4>
        <h4>
          <b><span id="campaign_contributeReview_contributeGas">0</span> Ether</b>
          <small>(ETH)</small>
        </h4>
      </div>
      <div class="col-xs-12 col-sm-4">
        <h4>Your Account</h4>
        <h4><b id="campaign_reviewAccountAddress"></b> </h4>
        <small>
          <i>Balance:
            <b id="campaign_reviewAccountBalance">0</b>
            Ether (ETH)</i>
        </small>

        <br />
        <br />

        <h4>Campaign Contract</h4>
        <h4><b>${options.campaignObject.addr}</b> </h4>
        <small><i>Balance: <b>${
          options.web3.fromWei(options.campaignObject.balance, 'ether').toString(10)
        }</b> Ether (ETH)</i></small>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <h4></h4>
        <h3><span id="campaign_contributeReview_transactionTotal"></span></h3>

        <br />

        <div id="campaign_contribute_info_response" class="alert alert-info" style="display: none;">
          <h4>Processing</h4>
          <p id="campaign_contribute_info_response_body"></p>
        </div>

        <div id="campaign_contribute_warning_response" class="alert alert-danger" style="display: none;">
          <h4>Warning!</h4>
          <p id="campaign_contribute_warning_response_body"></p>
        </div>

        <hr />

        <h4>Approx. Contribution Total</h4>
        <h4>
          <b id="campaign_contributeReview_totalContributeAmount">0</b> Ether
          <small>(ETH)</small>
        </h4>
        <p>Note, this total is an over approximation, your final contribution may end up being less than this total amount.</p>

        <br />
        <br />

        <a href=${`/campaign/${options.campaignObject.id}/contribute/form`} class="btn btn-primary btn-lg">
          Back
        </a>

        <button id="campaign-review-contribute-button" class="btn btn-primary btn-lg">
          Make Contribution
        </button>

      </div>
    </div>
  </div>`;
}
