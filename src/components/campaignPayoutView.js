const campaignPayoutView = function(options) {
  const t = options.t;
  const campaignObject = options.campaignObject;

  return `<div class="row center-block container" style="margin-top: 40px; margin-bottom: 150px;">
    <div class="col-xs-12">
      <div class="row center-block container text-center" style="margin-bottom: 60px;">
        <a href="/campaign/${campaignObject.id}/" target="_blank" style="color: #333; text-decoration: none;">
          <h1 class="text-pretty-huge">${campaignObject.name}</h1>
        </a>
        <h4>by ${campaignObject.owner}</h4>
      </div>
      <h3>Payout Campaign</h3>
      <br />
      <p>Payout the amount raised by this campaign to the beneficiary account specified.</p>
      <div class="row">
        <div class="col-xs-12">
          <h3>Beneficiary Account</h3>
          <h4>${campaignObject.beneficiary}</h4>
          <br />
          <h3>Feature Not Supported</h3>
          <h4>This feature is not yet supported.</h4>
        </div>
      </div>
    </div>
  </div>`;
};

module.exports = campaignPayoutView;
