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
            <b>0x3cd8541cab971372a55e580a6f8c4e363506ef38</b> etherscan

            <br />
            <br />

            <h4>Beneficiary</h4>
            <b>0x3364ed250ea774146a0fbbc1da0ffa6a81514ca7</b> etherscan
          </div>
          <div class="col-xs-12 col-md-6">
            <h4>Interface Address</h4>
            <b>0x3cd8541cab971372a55e580a6f8c4e363506ef38</b> etherscan
          </div>
        </div>

    </div>
  </div>`;
};

module.exports = campaignFocusContractsView;
