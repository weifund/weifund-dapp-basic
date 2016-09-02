const campaignFocusContractsView = function(options) {
  return `<div id="view-campaign-contracts" class="bg-white container row center-block" style="display: none;">
    <div class="col-xs-12">

        <div class="row">
          <div class="col-xs-12">
            <h3>Campaign Contract Details</h3>
            <br />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-6">
            <h4>Campaign Address</h4>
            <b>${options.campaignObject.addr}</b> etherscan

            <br />
            <br />

            <h4>Beneficiary</h4>
            <b>${options.campaignObject.beneficiary}</b> etherscan
          </div>
          <div class="col-xs-12 col-md-6">
            <h4>Interface Address</h4>
            <b>${options.campaignObject.interface}</b> etherscan
          </div>
        </div>

    </div>
  </div>`;
};

module.exports = campaignFocusContractsView;
