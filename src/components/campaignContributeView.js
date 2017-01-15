import yo from 'yo-yo';

import campaignContributeReceipt from './campaignContributeReceipt';
import campaignContributeForm from './campaignContributeForm';
import campaignContributeReview from './campaignContributeReview';
import campaignContributeNav from './campaignContributeNav';
import campaignContributeWallet from './campaignContributeWallet';

// main export
export default function campaignContributeView(options) {
  const campaignObject = options.campaignObject;
  const t = options.t;

  return yo`<div id="campaign-contribute" style="margin-top: 40px; margin-bottom: 150px;">

  <input type="hidden" value="${campaignObject.id}" id="campaign_id" />

  <div class="row center-block container text-center" style="margin-bottom: 60px;">
    <a href="/campaign/${campaignObject.id}/" target="_blank"
      style="color: #333; text-decoration: none;">
      <h1 class="text-pretty-huge">${campaignObject.name}</h1>
    </a>
    <h4>by ${campaignObject.owner}</h4>
  </div>

  ${campaignContributeWallet({
    campaignObject: options.campaignObject,
    t,
    getLocale: options.getLocale,
  })}

  ${campaignContributeForm({
    campaignObject: options.campaignObject,
    t,
    getLocale: options.getLocale,
    defaultAccount: options.defaultAccount,
    web3: options.web3,
  })}

  ${campaignContributeReview({
    campaignObject: options.campaignObject,
    t,
    getNetwork: options.getNetwork,
    getLocale: options.getLocale,
    defaultAccount: options.defaultAccount,
    web3: options.web3,
  })}

  <div id="view-campaign-contribute-receipt"></div>
</div>`;
}
