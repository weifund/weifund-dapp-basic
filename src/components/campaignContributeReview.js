const campaignContributeNav = require('./campaignContributeNav');

const campaignContributeReview = function(options) {
  const t = options.t;

  return `<div id="view-campaign-contribute-review" class="center-block container" style="margin-top: 40px; margin-bottom: 150px;">
    <div class="row">
      <div class="col-xs-12">
        <h3>Review Contribution
          <a href="javascript:window.print()">
            <button class="btn btn-sm text-gray" style="float: right;">
              Save Review Copy
            </button>
          </a>
        </h3>
        <h4>Almost done! Please review your contribution information before proceeding.</h4>
        <br />
        <br />
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-sm-6">
        <div id="campaign_contributeReviewInputs">
        </div>

        <h4>Campaign Contribution</h4>
        <h4><b><span id="campaign_contributeReview_contributeAmount"><span> Ether</b> <small>(ETH)</small></h4>
        <br />

        <h4>WeiFund Contribution</h4>
        <h4><b><span id="campaign_contributeReview_weifundContributeAmount"><span> Ether</b> <small>(ETH)</small></h4>
        <small>Note, this will create a small second transaction for the amount specified.</small>

      </div>
      <div class="col-xs-12 col-sm-6">

        <h4>Your Account</h4>
        <h4><b>${options.defaultAccount()}</b> </h4>
        <small><i>Balance: <b>300</b> Ether (ETH)</i></small>

        <br />
        <br />

        <h4>Campaign Contract</h4>
        <h4><b>${options.campaignObject.addr}</b> </h4>
        <small><i>Balance: <b>${options.web3.fromWei(options.campaignObject.balance, 'ether').toString(10)}</b> Ether (ETH)</i></small>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <h4>Total Transactions to Send</h4>
        <h3><span id="campaign_contributeReview_transactionTotal">0</span> Transactions Queued</h3>

        <br />
        <hr />

        <h4>Contribution Total</h4>
        <h4><b id="campaign_contributeReview_totalContributeAmount">0</b> Ether <small>(ETH)</small></h4>

        <br />
        <br />

        <button id="campaign_reviewContributeButton" class="btn btn-primary btn-lg">Make Contribution</button>

        <br />
        <br />

        <div id="campaign_contribute_info_response" class="alert alert-info" style="display: none;">
          <h4>Processing</h4>
          <p id="campaign_contribute_info_response_body"></p>
        </div>

        <div id="campaign_contribute_warning_response" class="alert alert-warning" style="display: none;">
          <h4>Warning!</h4>
          <p id="campaign_contribute_warning_response_body"></p>
        </div>

      </div>
    </div>
  </div>`;
};

module.exports = campaignContributeReview;
