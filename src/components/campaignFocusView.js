const oneDay = require('weifund-util').oneDay;

const campaignFocusOverviewView = require('./campaignFocusOverviewView');
const campaignFocusDetailsView = require('./campaignFocusDetailsView');
const campaignFocusContractsView = require('./campaignFocusContractsView');
const campaignFocusQRView = require('./campaignFocusQRView');
const campaignFocusNav = require('./campaignFocusNav');

const parseDisambiguatedDescription = function(campaignDataObject, locale) {
  return campaignDataObject.hasValidData && campaignDataObject.data.i18n[locale].disambiguatedDescription || `A childrens charity based around helping kids in need succeed in life.`;

  //`A crowdfund that is valid enough to be listed, but does not have a description.`
};

const campaignFocusView = function(options) {
  const t = options.t;
  const campaignObject = options.campaignObject;
  const web3 = options.web3;
  const getLocale = options.getLocale;

  if (typeof campaignObject === 'undefined') {
    setTimeout(options.reload, 5000);
    return;
  }

  return `<div class="campaign-focus" style="margin-top: 40px;">

    <div class="row center-block container text-center" style="margin-bottom: 60px;">
      <h1 style="font-size: 40px; font-weight: 500;">${campaignObject.name}</h1>
      <h4>${t('campaignFocusView.by')} ${campaignObject.owner}</h4>
    </div>

    <div class="container row center-block">
      <div class="col-xs-12 col-sm-8">
        ${`<iframe style="width: 100%; height: 410px;" src="${campaignObject.mainEntityIsVideo && campaignObject.mainEntityVideo.embedUrl || `https://www.youtube.com/embed/kn-1D5z3-Cs?showinfo=0`}" frameborder="0" allowfullscreen></iframe>`}
      </div>
      <div class="col-xs-12 col-sm-4">
        <h1><b>${campaignObject.progress}%</b></h1>
        <h4>${t('campaignFocusView.progress')}</h4>
        <h1><b>${web3.fromWei(campaignObject.amountRaised, 'ether').toFixed(4)} <small>ETH</small></b></h1>
        <h4>${t('campaignFocusView.contributedOf', {fundingGoal: web3.fromWei(campaignObject.fundingGoal, 'ether').toFixed(4), fundingGoalUnits: 'ETH'})}</h4>
        <h1><b>${campaignObject.hasExpired && "0" || campaignObject.expiry.toString(10)} </b></h1>
        <h4>${t('campaignFocusView.daysToGo')}</h4>

        <br /><br />



        ${(function(){

          if (campaignObject.hasFailed) {
            return `

            <a id="campaign_refundButton" href="/campaign/${campaignObject.id}/refund">
              <button class="btn btn-lg btn-warning">${t('campaignFocusView.buttons.refund')}</button>
            </a>

            `;
          } else {
            if (campaignObject.hasSucceeded) {
              return `

              <a id="campaign_payoutButton" href="/campaign/${campaignObject.id}/payout">
                <button class="btn btn-lg btn-success">${t('campaignFocusView.buttons.payout')}</button>
              </a>

            `;
            } else {
              return `

              <a id="campaign_contributeButton" ${campaignObject.active && `href="/campaign/${campaignObject.id}/contribute"` || ``}>
                <button ${campaignObject.active && `class="btn btn-lg btn-primary"` || `disabled="disabled" class="btn btn-lg btn-primary"` }>${t('campaignFocusView.buttons.contribute')}</button>
              </a>

              `;
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
        <div class="alert alert-warning" id="campaign_contributeFailureMessage" ${(campaignObject.active || campaignObject.hasSucceeded) && `style="display: none;"` || ``}>
          You can no longer contribute to this campaign as it is no longer active.
        </div>

        <br />

        <small>${t('campaignFocusView.expiryNotice', {expiryDate: (new Date(campaignObject.expiry.toNumber(10) * 1000)).toString()})}</small>
      </div>
    </div>

    <br /><br />

    <div style="background-color: #FFF; padding-bottom: 150px;">
      ${campaignFocusNav({campaignObject: campaignObject, getLocale: getLocale, t: t})}

      ${campaignFocusOverviewView({campaignObject: campaignObject, getLocale: getLocale, t: t})}      ${campaignFocusDetailsView({campaignObject: campaignObject, getLocale: getLocale, web3: web3, t: t})}      ${campaignFocusContractsView({campaignObject: campaignObject, getLocale: getLocale, t: t})}      ${campaignFocusQRView({campaignObject: campaignObject, getLocale: getLocale, t: t})}
    </div>
  </div>`;
};

module.exports = campaignFocusView;
