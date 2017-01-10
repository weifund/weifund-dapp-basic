import { oneDay } from 'weifund-util';

// export highlight medium
module.exports = campaignHighlightMedium;

// draw highlight campaign
function campaignHighlightMedium(options) {
  const t = options.t;
  const campaignObject = options.campaignObject;
  const web3 = options.web3;
  const getLocale = options.getLocale;

  // return nothing if invalid campaign
  if (!campaignObject.valid) {
    return ``;
  }

  return `
  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 list-feature-column">
    <div class="list-campaign-feature">
      <div class="row">
        <div class="col-xs-5" style="height: 100%; background: url(${campaignObject.imageUrl}); background-size: cover;">
        </div>
        <div class="col-xs-7">
            <a href="/campaign/${campaignObject.id}">
              <h3 class="text-gray">${campaignObject.name}</h3>
            </a>

            <p style="max-height: 40px;
overflow: hidden;
text-overflow: ellipsis;">
              ${(campaignObject.hasValidData
                && typeof campaignObject.data.campaignSchema.i18n[getLocale()] !== "undefined"
                && campaignObject.data.campaignSchema.i18n[getLocale()].description
                || t('campaignHighlightMedium.defaultDescription'))}
            </p>

            <div class="hidden-xs show-md">
              <br /><br />
            </div>

            <div class="hidden-xs hidden-sm show-md">
              <br />
            </div>

            <div class="row">
              <div class="col-xs-12">
                <div class="progress">
                  <div class="progress-bar" style="width: ${campaignObject.progress}%;"></div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-xs-4">
                <h4>${campaignObject.progress}%</h4>
              </div>
              <div class="col-xs-4">
                <h4>${web3.fromWei(campaignObject.amountRaised, 'ether')} ETH</h4>
              </div>
              <div class="col-xs-4">
                <h4>${web3.fromWei(campaignObject.fundingGoal, 'ether')} ETH</h4>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-4">
                <h6 style="margin-top: 0px;">${t('campaignHighlightMedium.progress')}</h6>
              </div>
              <div class="col-xs-4">
                <h6 style="margin-top: 0px;">${t('campaignHighlightMedium.raised')}</h6>
              </div>
              <div class="col-xs-4">
                <h6 style="margin-top: 0px;">${t('campaignHighlightMedium.goal')}</h6>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>`;
}
