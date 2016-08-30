const isBigNumber = require('../utils/').isBigNumber;

const toCapitalizedWords = function(name) {
    var words = name.match(/[A-Za-z][a-z]*/g);

    return words.map(capitalize).join(" ");
}

const capitalize = function(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

// intake object, return html
const objectToHTML = function(object, options) {
  var returnedHTML = ``;
  const web3 = options.web3;

  // move through layout, display what is set in options.layout
  Object.keys(options.layout).forEach(function(objectKey, keyIndex){
    // if property exists
    if (!object.hasOwnProperty(objectKey)) {
      return;
    }

    // setup value input, output and layout object
    const valueInput = object[objectKey];
    var valueOutput = `none`;
    var layoutObject = {};

    // build layout object, if any
    if (typeof options.layout[objectKey] === 'object') {
      layoutObject = options.layout[objectKey];
    }

    // handle input of undefined
    if (typeof valueInput === 'undefined') {
      valueOutput = 'undefined';
    }

    // handle boolean input
    if (typeof valueInput === 'boolean') {
      valueOutput = `${valueInput && `true` || `false`}`;
    }

    // handle number
    if (typeof valueInput === 'number') {
      valueOutput = `${String(valueInput)}`;
    }

    // handle string
    if (typeof valueInput === 'string') {
      valueOutput = valueInput;
    }

    // handle object
    if (typeof valueInput === 'object') {
      // handle bignumber
      if (isBigNumber(valueInput)) {
        valueOutput = valueInput.toString(10);
      }

      // handle just standard type
      valueOutput = `<pre style="overflow: scroll;">${JSON.stringify(valueInput, null, 2)}</pre>`
    }

    // handle special type ether
    if (layoutObject.type === 'ether') {
      valueOutput = `${web3.fromWei(valueInput, 'ether').toString(10)} ether (ETH)`;
    }

    // add to html return
    returnedHTML += `
      <br />
      <h4>${layoutObject.name && layoutObject.name || toCapitalizedWords(objectKey)}</h4>
      <small>${layoutObject.description}</small>
      <h5>${valueOutput}</h5>
    `;
  });

  // return html
  return returnedHTML;
};

const campaignFocusDetailsView = function(options) {
  const campaignObject = options.campaignObject;
  const web3 = options.web3;

  return `<div id="view-campaign-details" class="bg-white container row center-block" style="display: none; margin-top: 20px;">
    <div class="col-xs-12">

      <br />

      <div class="row">
        <div class="col-xs-12 col-sm-6">
          <h4>Address</h4>
          ${campaignObject.addr} <a href="http://etherscan.io/address/${campaignObject.addr}">etherscan</a>

          <br />
          <br />

          <h4>Amount Raised</h4>
          ${web3.fromWei(campaignObject.amountRaised, 'ether').toString(10)} ether (ETH)

          <br />
          <br />

          <h4>Beneficiary</h4>
          ${campaignObject.beneficiary}
        </div>
        <div class="col-xs-12 col-md-6">
          <h4>Funding Goal</h4>
          ${web3.fromWei(campaignObject.fundingGoal, 'ether').toString(10)} ether (ETH)

          <br />
          <br />

          <h4>Expiry</h4>
          ${(new Date(campaignObject.expiry * 1000))}.
          <small>unix. ${campaignObject.expiry}</small>

          <br />
          <br />

          <h4>Current Contract Balance</h4>
          ${web3.fromWei(campaignObject.balance, 'ether').toString(10)} ether (ETH)
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
          ${objectToHTML(campaignObject, {
            layout: {
              active: {
                description: 'Is the campaign active (i.e. can you contribute to it)',
              },
              hasName:  {
                description: 'Is the campaign named.',
              },
              hasFailed: {
                description: 'Has the campaign failed.',
              },
              hasExpired: {
                description: 'Has the campaign expired.',
              },
              hasSucceeded: {
                description: 'Has the campaign succeeded.',
              },
              valid: {
                description: 'Is all campaign data valid.',
              },
              hasPaidOut: {
                name: 'Is Valid Campaign',
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
            web3: web3
          })}
        </div>
        <div class="col-xs-12 col-md-6">
          ${objectToHTML(campaignObject, {layout: {
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
          }, web3: web3})}
        </div>
      </div>

    </div>

  </div>`;
};

module.exports = campaignFocusDetailsView;
