import yo from 'yo-yo';

// export method
module.exports = campaignContributeReceipt;

// main export
function campaignContributeReceipt(options){
  const t = options.t;
  const to = options.to;
  const from = options.from;

  return yo`<div>
  <div class="row center-block container" style="margin-top: 40px; margin-bottom: 150px;">
    <div class="col-xs-12">
      <h3>Contribution Receipt
        <a href="javascript:window.print()">
          <button class="btn btn-sm text-gray" style="float: right;">
            Print Receipt
          </button>
        </a>
      </h3>

      <br />

      <h4>Transaction Hash</h4>
      ${options.receipt.transactionHash}

      <br /> <br />

      <h4>To (Campaign Account)</h4>
      ${to}

      <br /> <br />

      <h4>From (Your Selected Account)</h4>
      ${from}

      <br /> <br />

      <h4>Block Number</h4>
      ${options.receipt.blockNumber !== null
        && options.receipt.blockNumber.toString(10) || 'pending'}

      <br /> <br />
      <h4>Cumulative Gas Used</h4>
      ${options.receipt.cumulativeGasUsed !== null
        && options.receipt.cumulativeGasUsed.toString(10) || 'pending'} wei

      <br /> <br /> <br />

      <a class="btn btn-lg btn-primary" href="javascript:window.print()">
        Save Receipt
      </a>
    </div>
  </div></div>`;
}
