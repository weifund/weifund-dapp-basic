const web3 = require('../web3').web3;
const getLocale = require('../environment').getLocale;
const oneDay = require('../utils/').oneDay;

const parseDisambiguatedDescription = function(campaignDataObject) {
  return campaignDataObject.hasValidData && campaignDataObject.data.i18n[getLocale()].disambiguatedDescription || `A crowdfund that is valid enough to be listed, but does not have a description.`;
}

const campaignMedium = function(campaignObject) {
  if (!campaignObject.valid) {
    return ``;
  }

  return `<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
    <div class="list-campaign-medium">
      <a href="/campaign/${campaignObject.id}">
        <div class="list-campaign-image-wrapper">
          <div class="list-campaign-image" style="background: url(${campaignObject.imageUrl});"></div>
        </div>
      </a>
      <div class="list-campaign-medium-description">
        <a href="/campaign/${campaignObject.id}">
          <h3>${campaignObject.name}</h3>
        </a>

        <p style="display: block; min-height: 50px;">${parseDisambiguatedDescription(campaignObject)}</p>

        <div class="row">
          <div class="col-xs-12">
            <div class="progress">
              <div class="progress-bar" style="width: ${campaignObject.progress}%;"></div>
            </div>
          </div>
        </div>

        <div style="min-height: 70px;">
          <div class="row">
            <div class="col-xs-4">
              <h4>${campaignObject.progress}%</h4>
            </div>
            <div class="col-xs-4">
              <h4>${web3.fromWei(campaignObject.amountRaised, 'ether').toFixed(2)} ETH</h4>
            </div>
            <div class="col-xs-4">
              <h4>${web3.fromWei(campaignObject.amountRaised, 'ether').toFixed(2)} ETH</h4>
            </div>
          </div>
          <div class="row" style="padding-top: 0px;">
            <div class="col-xs-4" style="padding-top: 0px;">
              <h6 style="margin-top: 0px; margin-bottom: 0px;">Progress</h6>
            </div>
            <div class="col-xs-4" style="padding-top: 0px;">
              <h6 style="margin-top: 0px; margin-bottom: 0px;">Raised</h6>
            </div>
            <div class="col-xs-4" style="padding-top: 0px;">
              <h6 style="margin-top: 0px; margin-bottom: 0px;">Goal</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

module.exports = campaignMedium;
