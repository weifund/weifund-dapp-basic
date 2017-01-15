import yo from 'yo-yo';

// main export
export default function campaignFocusNav(options) {
  const campaignObject = options.campaignObject;
  const t = options.t;

  return yo`<div><hr style="margin-top: 0px;" />

  <div class="container row center-block campaign-focus-nav" style="height: 28px; margin-top: 20px;">
    <div class="col-xs-12 col-sm-8">
      <a href="/campaign/${campaignObject.id}/info" class="text-gray">
        ${t('campaignFocusNav.campaign')}
      </a>
      <a href="/campaign/${campaignObject.id}/details" class="text-gray" style="padding-left: 40px;">
        ${t('campaignFocusNav.details')}
      </a>
      <a href="/campaign/${campaignObject.id}/contracts" class="text-gray" style="padding-left: 40px;">
        ${t('campaignFocusNav.contracts')}
      </a>
      <a href="/campaign/${campaignObject.id}/qr" class="text-gray" style="padding-left: 40px;">
        ${t('campaignFocusNav.qrcode')}
      </a>
    </div>

    <div class="col-xs-12 col-sm-4">
    </div>
  </div>

  <hr style="margin-bottom: 60px;" /></div>`;
}
