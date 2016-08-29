const web3 = require('../web3').web3;
const getLocale = require('../environment').getLocale;
const oneDay = require('../utils/').oneDay;

const parseDisambiguatedDescription = function(campaignDataObject) {
  return campaignDataObject.hasValidData && campaignDataObject.data.i18n[getLocale()].disambiguatedDescription || `A crowdfund that is valid enough to be listed, but does not have a description.`;
}

// draw highlight campaign
const campaignHighlightMedium = function(campaignObject) {
  // return nothing if invalid campaign
  if (!campaignObject.valid) {
    return ``;
  }

  return `
  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 list-feature-column">
    <div class="list-campaign-feature">
      <div class="row">
        <div class="col-xs-5" style="height: 100%; background: url(${campaignObject.imageUrl});">
        </div>
        <div class="col-xs-7">
            <a href="/campaign/${campaignObject.id}">
              <h3 class="text-gray">${campaignObject.name}</h3>
            </a>

            <p style="max-height: 40px;
overflow: hidden;
text-overflow: ellipsis;">${parseDisambiguatedDescription(campaignObject)}</p>

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
                <h6 style="margin-top: 0px;">Progress</h6>
              </div>
              <div class="col-xs-4">
                <h6 style="margin-top: 0px;">Raised</h6>
              </div>
              <div class="col-xs-4">
                <h6 style="margin-top: 0px;">Goal</h6>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>`;
};

module.exports = campaignHighlightMedium;
