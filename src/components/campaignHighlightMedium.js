import yo from 'yo-yo';
import { oneDay } from 'weifund-util';
import { nameOf } from '../environment';

// draw highlight campaign
export default function campaignHighlightMedium(options) {
  const t = options.t;
  const campaignObject = options.campaignObject;
  const web3 = options.web3;
  const getLocale = options.getLocale;

  // return nothing if invalid campaign
  if (!campaignObject.valid) {
    return ``;
  }

  return yo`<div>
  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 list-feature-column">
    <div class="list-campaign-feature">
      <div class="row">
        <a href="/campaign/${campaignObject.id}" class="col-xs-5" style="height: 100%;
          background: url(${campaignObject.data.campaignSchema.image});
          background-position: center;
          background-size: cover;">
        </a>
        <div class="col-xs-7">
            <a href="/campaign/${campaignObject.id}">
              <h3 class="text-gray">${campaignObject.name}</h3>
              <small class="text-gray">by ${nameOf(campaignObject.owner)}</small>
            </a>

            <p style="max-height: 40px; margin-top: 18px;
overflow: hidden;
text-overflow: ellipsis;">
              ${(campaignObject.hasValidData
                && typeof campaignObject.data.campaignSchema.i18n[getLocale()] !== "undefined"
                && campaignObject.data.campaignSchema.i18n[getLocale()].description
                || t('campaignHighlightMedium.defaultDescription'))}
            </p>

            <div class="hidden-xs show-sm hidden-md show-lg">
              <br />
            </div>

            <div class="hidden-xs show-sm hidden-md show-lg">
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
              <div class="col-xs-3 col-sm-4">
                <h4>${campaignObject.progress}%</h4>
              </div>
              <div class="col-xs-5 col-sm-4">
                <h4>${web3.fromWei(campaignObject.amountRaised, 'ether').round(4).toString(10)} ETH</h4>
              </div>
              <div class="col-xs-4 col-sm-4">
                <h4>${campaignObject.approximateDaysToGo.toString(10)}</h4>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-3 col-sm-4">
                <h6 style="margin-top: 0px;">${t('campaignHighlightMedium.progress')}</h6>
              </div>
              <div class="col-xs-5 col-sm-4">
                <h6 style="margin-top: 0px;">${t('campaignHighlightMedium.raised')}</h6>
              </div>
              <div class="col-xs-4 col-sm-4">
                <h6 style="margin-top: 0px;">days left</h6>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div></div>`;
}
