import yo from 'yo-yo';
import { etherScanAddressUrl, etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';

import campaignFocusOverviewView from './campaignFocusOverviewView';
import campaignFocusDetailsView from './campaignFocusDetailsView';
import campaignFocusContractsView from './campaignFocusContractsView';
import campaignFocusQRView from './campaignFocusQRView';
import campaignFocusNav from './campaignFocusNav';
import { nameOf, getNetwork } from '../environment';

function parseDisambiguatedDescription(campaignDataObject, locale) {
  return campaignDataObject.hasValidData
    && campaignDataObject.data.i18n[locale].disambiguatedDescription
    || `No description available.`;

  //`A crowdfund that is valid enough to be listed, but does not have a description.`
}

export default function campaignFocusView(options) {
  const t = options.t;
  const campaignObject = options.campaignObject;
  const web3 = options.web3;
  const getLocale = options.getLocale;

  if (typeof campaignObject === 'undefined') {
    setTimeout(options.reload, 5000);
    return;
  }

  /* ${yo`<iframe style="width: 100%; height: 410px;"
  src="${campaignObject.mainEntityIsVideo && campaignObject.mainEntityVideo.embedUrl
      || `https://www.youtube.com/embed/kn-1D5z3-Cs?showinfo=0`}"
  frameborder="0" allowfullscreen></iframe>`} */

  return yo`<div><div class="campaign-focus" style="margin-top: 40px;">

    <div class="row center-block container text-center" style="margin-bottom: 60px;">
      <h1 style="font-size: 40px; font-weight: 500;">${campaignObject.name}</h1>
      <h4>
        ${t('campaignFocusView.by')}
        <a href=${etherScanAddressUrl(campaignObject.owner, getNetwork())}
          style="color: #333;"
          target="_blank">
          ${nameOf(campaignObject.owner)}
        </a>
      </h4>
    </div>

    <div class="container row center-block">
      <div class="col-xs-12 col-sm-8">

        ${yo`<div
          style="width: 100%;
            height: 430px;
            background: url(${campaignObject.data.campaignSchema.image});
            background-position: center;
            background-size: cover;"></div>`}
      </div>
      <div class="col-xs-12 col-sm-4">
        <h1><b>${campaignObject.progress}%</b></h1>
        <h4>${t('campaignFocusView.progress')}</h4>
        <h1><b>${web3.fromWei(campaignObject.amountRaised, 'ether').toFixed(4)}
          <small>ETH</small></b></h1>
        <h4>${t('campaignFocusView.contributedOf', {
          fundingGoal: web3.fromWei(campaignObject.fundingGoal, 'ether').toFixed(4),
          fundingGoalUnits: 'ETH'})}</h4>
        <h1><b>${campaignObject.approximateDaysToGo.toString(10)} </b></h1>
        <h4>${t('campaignFocusView.daysToGo')}</h4>

        <br /><br />

        ${(function(){

          if (campaignObject.hasFailed) {
            return yo`<a id="campaign_refundButton" href="/campaign/${campaignObject.id}/refund">
              <button class="btn btn-lg btn-warning">${t('campaignFocusView.buttons.refund')}</button>
            </a>`;
          } else {
            if (campaignObject.hasSucceeded) {
              return yo`<a id="campaign_payoutButton" href="/campaign/${campaignObject.id}/payout">
                <button class="btn btn-lg btn-success">${t('campaignFocusView.buttons.payout')}</button>
              </a>`;
            } else {
              return yo`<a id="campaign_contributeButton" href=${campaignObject.active && `/campaign/${campaignObject.id}/contribute` || ``}>
                ${campaignObject.active
                  && yo`<button class="btn btn-lg btn-primary">
                    ${t('campaignFocusView.buttons.contribute')}
                  </button>`
                  || yo`<button disabled="disabled" class="btn btn-lg btn-primary">
                    ${t('campaignFocusView.buttons.contribute')}
                  </button>`}
                </a>`;
            }
          }

        })()}
      </div>
    </div>

    <div class="container row center-block" style="margin-top: 20px;">
      <div class="col-xs-12 col-sm-8">
        <h4>${t('campaignFocusView.overview')}</h4>
        <h3>${(campaignObject.hasValidData
              && typeof campaignObject.data.campaignSchema.i18n[getLocale()] !== "undefined"
              && campaignObject.data.campaignSchema.i18n[getLocale()].disambiguatedDescription
              || t('campaignFocusView.defaultDescription'))}</h3>
      </div>
      <div class="col-xs-12 col-sm-4">
        <div class="alert alert-warning"
          id="campaign_contributeFailureMessage"
          style=${(campaignObject.active || campaignObject.hasSucceeded) && `display: none;` || ``}>
          You can no longer contribute to this campaign as it is no longer active.
        </div>

        <br />

        <small>${t('campaignFocusView.expiryNotice', {
          expiryDate: campaignObject.approximateExpiryDate.toISOString(),
        })}</small>
      </div>
    </div>

    <br /><br />

    <div style="background-color: #FFF; padding-bottom: 150px;">
      ${campaignFocusNav({ campaignObject, getLocale, t })}

      ${campaignFocusOverviewView({ campaignObject, getLocale, t })}

      ${campaignFocusDetailsView({ campaignObject, getLocale, web3, t })}

      ${campaignFocusContractsView({ campaignObject, getLocale, t })}

      ${campaignFocusQRView({ campaignObject, getLocale, t })}
    </div>
  </div></div>`;
};

module.exports = campaignFocusView;
