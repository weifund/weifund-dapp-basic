import yo from 'yo-yo';

// main export
export default function campaignRefundReceipt(options){
  const t = options.t;

  return yo`<div class="row center-block container"
    style="margin-top: 40px; margin-bottom: 150px;">
    <div class="col-xs-12">
      <h3>Refund Receipt
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
      ${options.receipt.to}

      <br /> <br />

      <h4>From (Your Selected Account)</h4>
      ${options.receipt.from}

      <br /> <br />

      <h4>Block Number</h4>
      ${options.receipt.blockNumber.toString(10)}

      <br /> <br />
      <h4>Cumulative Gas Used</h4>
      ${options.receipt.cumulativeGasUsed.toString(10)} wei

      <br /> <br /> <br />

      <a class="btn btn-lg btn-primary" href="javascript:window.print()">
        Save Receipt
      </a>
    </div>
  </div>`;
}
