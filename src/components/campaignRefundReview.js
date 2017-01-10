import methodABIInputsReview from './methodABIInputsReview';

// export method
module.exports = campaignRefundReview;

// main export
function campaignRefundReview(options) {
  const campaignObject = options.campaignObject;
  const defaultAccount = options.defaultAccount;
  const t = options.t;

  return `
  <div id="view-campaign-refund-review" class="center-block container" style="margin-top: 40px; margin-bottom: 150px; display: none;">
    <div id="campaign-refund-header" class="row center-block container" style="margin-top: 80px;">
      <input type="hidden" value="${campaignObject.id}" id="campaign_id" />

      <div class="row center-block container text-center" style="margin-bottom: 60px;">
        <a href="/campaign/${campaignObject.id}/" target="_blank" style="color: #333; text-decoration: none;">
          <h1 class="text-pretty-huge">${campaignObject.name}</h1>
        </a>
        <h4>by ${campaignObject.owner}</h4>
      </div>
    </div>

      <div class="row">
        <div class="col-xs-12">
          <h3>Review Refund
            <a href="javascript:window.print()">
              <button class="btn btn-sm text-gray" style="float: right;">
                Save Review Copy
              </button>
            </a>
          </h3>
          <h4>Almost done! Please review your refund information before proceeding.</h4>
          <br />
          <br />
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-sm-6">
          <div id="campaign_contributeReviewInputs">${methodABIInputsReview({campaignObject: campaignObject, methodType: 'refund'})}</div>

          <h4>WeiFund Contribution</h4>
          <h4><b><span id="campaign_contributeReview_weifundContributeAmount">0<span> Ether</b> <small>(ETH)</small></h4>
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
          <br />
          <hr />

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
}
