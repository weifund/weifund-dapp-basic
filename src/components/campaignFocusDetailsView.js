import yo from 'yo-yo';

// object to html
import objectView from './objectView';
import { getNetwork } from '../environment';
import { etherScanAddressUrl, etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';


// main export
export default function campaignFocusDetailsView(options) {
  const t = options.t;

  const campaignObject = options.campaignObject;
  const web3 = options.web3;

  return yo`<div><div id="view-campaign-details" class="bg-white container row center-block" style="display: none; margin-top: 20px;">
    <div class="col-xs-12">

      <br />

      <div class="row">
        <div class="col-xs-12 col-sm-6">
          <h4>Campaign Contract Balance</h4>
          ${web3.fromWei(campaignObject.balance, 'ether').round(4).toString(10)} ether (ETH)

          <br />
          <br />

          <h4>Amount Raised</h4>
          ${web3.fromWei(campaignObject.amountRaised, 'ether').round(4).toString(10)} ether (ETH)

          <br />
          <br />

          <h4>Funding Goal</h4>
          ${web3.fromWei(campaignObject.fundingGoal, 'ether').toString(10)} ether (ETH)

          <br />
          <br />

          <h4>Funding Cap</h4>
          ${web3.fromWei(campaignObject.fundingCap, 'ether').toString(10)} ether (ETH)
        </div>
        <div class="col-xs-12 col-md-6">
          <h4>Address</h4>
          ${campaignObject.addr}
          <a target="_blank" href=${etherScanAddressUrl(campaignObject.addr, getNetwork())}>
            etherscan
          </a>

          <br />
          <br />

          <h4>Beneficiary</h4>
          ${campaignObject.beneficiary}
          <a target="_blank"
          href=${etherScanAddressUrl(campaignObject.beneficiary, getNetwork())}>
            etherscan
          </a>

          <br />
          <br />

          <h4>Token</h4>
          ${campaignObject.token}
          <a target="_blank"
          href=${etherScanAddressUrl(campaignObject.token, getNetwork())}>
            etherscan
          </a>

          <br />
          <br />

          <h4>Expiry</h4>
          approx. ${campaignObject.approximateExpiryDate.toUTCString()}
          <br />
          <small>current. block ${campaignObject.blockNumber.toString(10)} exp. block ${campaignObject.expiry.toString(10)}</small>
        </div>
      </div>

      <div class="row" style="margin-top: 75px;">
        <div class="col-xs-12">
          <h3>Technical Details</h3>
          <br />
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-sm-6">
          ${objectView({web3, object: campaignObject, layout: {
              hasName:  {
                name: 'Has Name',
                description: 'Is the campaign named.',
              },
              hasFailed: {
                name: 'Has Failed',
                description: 'Has the campaign failed.',
              },
              hasExpired: {
                name: 'Has Expired',
                description: 'Has the campaign expired.',
              },
              hasSucceeded: {
                name: 'Has Succeeded',
                description: 'Has the campaign succeeded.',
              },
              valid: {
                description: 'Is all campaign data valid.',
              },
              hasPaidOut: {
                name: 'Paid Out',
                description: 'Has the campaign been paid out.',
              },
              hasIPFSHash: {
                name: 'Has IPFS Hash',
                description: 'Does the campaign have an IPFS hash.',
              },
              hasData: {
                description: 'Does the campaign have data (such as IPFS data).',
              },
              hasOwner: {
                description: 'Does the campaign have an owner address specified.',
              },
              hasFundingGoal: {
                description: 'The campaign funding goal.',
              },
              hasAmountRaised: {
                description: 'The amount raised by the campaign',
              },
              hasValidContributeMethodABI: {
                name: 'Has Valid Contribute Method ABI',
                description: 'Does the campaign have a valid contribute method ABI specified.',
              },
              hasValidPayoutMethodABI: {
                name: 'Has Valid Payout Method ABI',
                description: 'Does the campaign have a valid payout method ABI specified.',
              },
              hasValidRefundMethodABI: {
                name: 'Has Valid Refund Method ABI',
                description: 'Does the campaign have a valid refund method ABI specified.',
              },

              hasMailChimp: {
                name: 'Has MailChimp Integration',
                description: 'Does the campaign have a MailChimp signup.',
              },
            },
            hasImage: {
              description: 'Does the campaign have an image specified.',
            },
            hasValidImage: {
              description: 'Does the campaign have valid image data.',
            },
            imageUrl: {
              description: 'The URL of the campaign image.',
            },
            interfaceIsCampaignAddress: {
              description: 'Is the registered interface contract the campaign contract.',
            },
            hasValidIPFSHash: {
              name: 'Has Valid IPFS Hash',
              description: 'Does the campaign have a valid IPFS hash',
            },
            hasValidData: {
              description: 'Does the campaign have valid data (i.e. valid IPFS data).',
            },
            beneficiaryIsContract: {
              description: 'Is the beneficiary of this campaign a contract.',
            },
            hasValidInterfaceAddress: {
              description: 'Has a valid interface address.',
            },
            hasValidAddress: {
              description: 'Does the camaign have a valid address.',
            },
            hasValidOwnerAddress: {
              description: 'Does the campaign have a valid owner address.',
            },
            campaignIsContract: {
              description: 'Is the campaign a contract.',
            },
            campaignIsStandard: {
              description: 'Is the campaign a standard campaign.',
            },
            loadTime: {
              description: 'The total load time of the campaign data.',
            },
            progress: {
              type: 'percentage',
              description: 'The percentage progress of the campaign.',
            },
        })}
        </div>
        <div class="col-xs-12 col-md-6">
          ${objectView({web3, object: campaignObject, layout: {
            contributeMethodABIObject: {
              description: 'The contribute method interface object.',
            },
            payoutMethodABIObject: {
              description: 'The payout method interface object.',
            },
            refundMethodABIObject: {
              description: 'The refund method interface.',
            },
            hasValidBeneficiaryAddress: {
              description: 'Does the campaign have a valid beneficiary address.',
            },
            abi: {
              description: 'The generated campaign contract ABI object.',
            },
          }})}
        </div>
      </div>

    </div>

  </div></div>`;
}
