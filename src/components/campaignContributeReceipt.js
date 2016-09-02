/*{ "blockHash": "0xea9234b2dc91e546ae30bf4595312ff858c9ec60a5691de6191658f89a583092", "blockNumber": 1583603, "contractAddress": null, "cumulativeGasUsed": 179913, "from": "0x3364ed250ea774146a0fbbc1da0ffa6a81514ca7", "gasUsed": 124323, "logs": [ { "address": "0x939e88414a54c8368c4530e48afcf7c20eecb7ce", "blockHash": "0xea9234b2dc91e546ae30bf4595312ff858c9ec60a5691de6191658f89a583092", "blockNumber": 1583603, "data": "0x0000000000000000000000003364ed250ea774146a0fbbc1da0ffa6a81514ca7", "logIndex": 2, "topics": [ "0x97a3367c201ad38e0d37322fd0ffa1b93457541ae8baf20eb9aa50bb83fcabef" ], "transactionHash": "0xb6b5fbca1c30845d0fc4f6069663d3eef177dfe45569a4b8245c7e8a3d39926f", "transactionIndex": 2 } ], "root": "9a0c47b2b12961a949ba3bec3fec83242d6e64a1c6e2703202b90a5474dcc848", "to": "0x939e88414a54c8368c4530e48afcf7c20eecb7ce", "transactionHash": "0xb6b5fbca1c30845d0fc4f6069663d3eef177dfe45569a4b8245c7e8a3d39926f", "transactionIndex": 2 } */

const campaignContributeReceipt = function(options){
  return `
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
};

module.exports = campaignContributeReceipt;
