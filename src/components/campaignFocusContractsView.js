import yo from 'yo-yo';

import { etherScanAddressUrl } from 'weifund-util';
import { getNetwork } from '../environment';

// export method
export default function campaignFocusContractsView(options) {
  const t = options.t;

  return yo`<div>
  <div id="view-campaign-contracts"
    class="bg-white container row center-block"
    style="display: none;">
    <div class="col-xs-12">

        <div class="row">
          <div class="col-xs-12">
            <h3>Campaign Contract Details</h3>
            <br />
          </div>
        </div>

        <div class="row">
          <div class="col-xs-12 col-sm-6">
            <h4>Campaign Address</h4>
            <b>${options.campaignObject.addr}</b>
            <a href=${etherScanAddressUrl(options.campaignObject.addr, getNetwork())}
              target="_blank">
              etherscan
            </a>

            <br />
            <br />

            <h4>Beneficiary</h4>
            <b>${options.campaignObject.beneficiary}</b>
            <a href=${etherScanAddressUrl(options.campaignObject.beneficiary, getNetwork())}
              target="_blank">
              etherscan
            </a>
          </div>
          <div class="col-xs-12 col-md-6">
            <h4>Interface Address</h4>
            <b>${options.campaignObject.interface}</b>
            <a href=${etherScanAddressUrl(options.campaignObject.interface, getNetwork())}
              target="_blank">
              etherscan
            </a>
          </div>
        </div>

    </div>
  </div></div>`;
}
