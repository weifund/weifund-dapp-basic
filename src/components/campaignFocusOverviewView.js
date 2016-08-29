const campaignFocusOverviewView = function(options) {
  const campaignObject = options.campaignObject;
  const getLocale = options.getLocale;

  return `
<div id="view-campaign-info">

  <div class="container  row center-block" style="margin-top: 20px;">
    <div class="col-xs-12 col-sm-8">
      <h3>About This Project</h3>

      <br /><br />

      <div class="row">
        <div class="col-xs-12">
          ${campaignObject.hasValidData && campaignObject.data.i18n[getLocale()].about || 'No about section was written for this campaign.'}
        </div>
      </div>
    </div>

    <div class="col-xs-12 col-sm-4">

      <div class="row">
        <div class="col-xs-12">
          <h4>Address</h4>
          <a href="http://etherscan.io/address/${campaignObject.addr}" class="text-break-all" style="width: 100%;">${campaignObject.addr}</a>

          <br /><br />

          <h4>Expires</h4>
          <span>${(new Date(campaignObject.expiry * 1000)).toString()}</span>

          <br /><br />

          <h4>Website</h4>
          ${campaignObject.hasValidData && `<a href="${campaignObject.data.url}">${campaignObject.data.url}</a>` || `No website was found`}</a>
        </div>
      </div>

    </div>
  </div>
</div>`;
};

module.exports = campaignFocusOverviewView;
