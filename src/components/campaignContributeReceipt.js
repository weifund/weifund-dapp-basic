import yo from 'yo-yo';
import BigNumber from 'bignumber.js';

import { web3 } from '../web3';
import { el } from '../document';
import { getAccountBalance, txObject } from '../environment';
import { saveWalletFile } from '../keystore';

// main export
export default function campaignContributeReceipt(options){
  const t = options.t;
  const to = options.to;
  const from = options.from;

  const contributeAmount = el('#campaign_contributeAmount').value;
  const accountBalance = getAccountBalance();
  const contributeTotal = new BigNumber(contributeAmount);

  return yo`<div>
  <div class="row center-block container" style="margin-top: 40px; margin-bottom: 150px;">
    <div class="col-xs-12">
      <h3>Contribution Receipt
        <a href="javascript:window.print()">
          <button class="btn btn-sm text-gray" style="float: right;">
            Print Receipt
          </button>
        </a>
        <button
          onclick=${() => saveWalletFile()}
          class="btn btn-sm text-gray" style="float: right; margin-right: 10px;">
          Download Encrypted Wallet
        </button>
      </h3>

      <br />

      <div class="row">
        <div class="col-xs-8" style="word-break: break-all;">
          <h4>Transaction Hash</h4>
          ${options.receipt.transactionHash}

          <br /> <br />

          <h4>To (Campaign Account)</h4>
          ${to}

          <br /> <br />

          <h4>From (Your Selected Account)</h4>
          ${from}
        </div>
        <div class="col-xs-4">
          <h4>Block Number</h4>
          ${options.receipt.blockNumber !== null
            && options.receipt.blockNumber.toString(10) || 'pending'}

          <br /> <br />

          <h4>Value</h4>
          ${contributeTotal.toString(10)} ether

          <br /> <br />

          <h4>Cumulative Gas Used</h4>
          ${options.receipt.cumulativeGasUsed !== null
            && options.receipt.cumulativeGasUsed.toString(10) || 'pending'} wei
        </div>
      </div>

      <br />
      <br />

      <div class="row">
        <div class="col-xs-12">
          <a href="/" class="btn btn-primary">
            Campaign List
          </a>
          <a href="/account" class="btn btn-primary">
            Manage Account & Tokens
          </a>
        </div>
      </div>

    </div>
  </div></div>`;
}
