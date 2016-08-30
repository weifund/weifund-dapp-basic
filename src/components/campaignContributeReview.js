const campaignContributeNav = require('./campaignContributeNav');

const campaignContributeReview = function(options) {
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
        <h4>Founder Amount</h4>
        <h4><b>500 Gnosis Tokens</b></h4>
        <br />
        <h4>Campaign Contribution</h4>
        <h4><b>3 Ether</b> <small>(ETH)</small></h4>
        <br />
        <h4>WeiFund Contribution</h4>
        <h4><b>.3 Ether</b> <small>(ETH)</small></h4>
        <small>Note, this will create a small second transaction of .3 ether (ETH).</small>
      </div>
      <div class="col-xs-12 col-sm-6">
        <h4>Your Account</h4>
        <h4><b>0x8e6316f44baeeee5d41a1070516cc5fa47baf222</b> </h4>
        <small><i>Balance: <b>300</b> Ether (ETH)</i></small>
        <br />
        <br />
        <h4>Campaign Contract</h4>
        <h4><b>0xFe6316f44baeeee5d41a1070516cc5fa47baf22e</b> </h4>
        <small><i>Balance: <b>22</b> Ether (ETH)</i></small>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12">
        <br />
        <hr />
        <h4>Contribution Total</h4>
        <h4><b>3.3 Ether</b> <small>(ETH)</small></h4>
        <br />
        <br />
        <button class="btn btn-primary btn-lg">Make Contribution</button>
        <br />
        <br />
        <div class="alert alert-dismissible alert-warning" style="display: none;">
          <h4>Warning!</h4>
          <p>Best check yo self, you're not looking too good. Nulla vitae elit libero, a pharetra augue. Praesent commodo cursus magna, <a href="#" class="alert-link">vel scelerisque nisl consectetur et</a>.</p>
        </div>
      </div>
    </div>
  </div>`;
};

module.exports = campaignContributeReview;
