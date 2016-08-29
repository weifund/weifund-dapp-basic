const campaignFocusNav = function(options) {
  const campaignObject = options.campaignObject;

  return `<hr style="margin-top: 0px;" />

  <div class="container row center-block campaign-focus-nav" style="height: 28px; margin-top: 20px;">
    <div class="col-xs-12 col-sm-8">
      <a href="/campaign/${campaignObject.id}/info" class="text-gray">
        Campaign
      </a>
      <a href="/campaign/${campaignObject.id}/details" class="text-gray" style="padding-left: 40px;">
        Details
      </a>
      <a href="/campaign/${campaignObject.id}/contracts" class="text-gray" style="padding-left: 40px;">
        Contracts
      </a>
      <a href="/campaign/${campaignObject.id}/qr" class="text-gray" style="padding-left: 40px;">
        QR
      </a>
    </div>

    <div class="col-xs-12 col-sm-4">
    </div>
  </div>

  <hr style="margin-bottom: 60px;" />`;
};

module.exports = campaignFocusNav;
