import yo from 'yo-yo';
import { etherScanAddressUrl, etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';

import { getNetwork } from '../environment';


export default function campaignFocusOverviewView(options) {
  var mailChimpFormAction = '';
  var showMailChimp = false;

  const t = options.t;
  const campaignObject = options.campaignObject;
  const getLocale = options.getLocale;

  // if IPFS data is present and mailchimp
  if (campaignObject.hasValidData) {
    try {
      if (campaignObject.hasMailChimp) {
        showMailChimp = true;
        mailChimpFormAction = campaignObject.data.mailChimp.forms[0].action;
      }
    } catch (mailChimpDrawError) {
      log(`MailChimp draw error: ${mailChimpDrawError}`);
    }
  }

  return yo`<div id="view-campaign-info">

  <div class="container  row center-block" style="margin-top: 20px;">
    <div class="col-xs-12 col-sm-8">
      <h3>About This Project</h3>

      <br /><br />

      <div class="row">
        <div class="col-xs-12">
          ${campaignObject.hasValidData
            && campaignObject.data.campaignSchema.i18n[getLocale()].about
            || 'No about section was written for this campaign.'}
        </div>
      </div>

      <br /><br />

      <div class="row">
        <div class="col-xs-12">
          <div id="mc_embed_signup" style=${showMailChimp && '' || 'display: none;'}>
            <form action="${mailChimpFormAction}" method="post"
              id="mc-embedded-subscribe-form"
              name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
              <div id="mc_embed_signup_scroll">
              <h3>Subscribe to our mailing list</h3>
              <h4>via <a href="https://mailchimp.com">MailChimp</a></h4>
              <br /><br />
              <div class="mc-field-group">
                <label for="mce-EMAIL">Email Address </label>
                <input type="email" value="" name="EMAIL"
                  placeholder="john@gmail.com" class="required email form-control"  id="mce-EMAIL">
              </div>
              <div id="mce-responses" class="clear">
                <div class="response" id="mce-error-response" style="display:none"></div>
                <div class="response" id="mce-success-response" style="display:none"></div>
              </div>
              <div style="position: absolute; left: -5000px;" aria-hidden="true">
                <input type="text" name="b_19406abd2b46ce9447a91562e_f5c4326349"
                  tabindex="-1" value="">
              </div>
              <br />
              <div class="clear">
                <input type="submit" value="Subscribe" name="subscribe"
                  id="mc-embedded-subscribe" class="button btn btn-primary">
              </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="col-xs-12 col-sm-4">

      <div class="row">
        <div class="col-xs-12">
          <h4>Address</h4>
          <a href=${etherScanAddressUrl(campaignObject.addr, getNetwork())}
            target="_blank"
            class="text-break-all"
            style="width: 100%;">
            ${campaignObject.addr}
          </a>

          <br /><br />

          <h4>Expires</h4>
          <span>${campaignObject.approximateExpiryDate.toUTCString()}</span>

          <br /><br />

          <h4>Website</h4>
          ${campaignObject.hasValidData
            && yo`<a href="${campaignObject.data.campaignSchema.url}" target="_blank">
              ${campaignObject.data.campaignSchema.url}</a>`
            || `No website was found`}</a>
        </div>
      </div>

    </div>
  </div>
</div>`;
};

module.exports = campaignFocusOverviewView;
