const campaignContributeReceipt = function(options){
  return `
  <div id="view-campaign-contribute-receipt" class="row center-block container" style="margin-top: 40px; margin-bottom: 150px;">
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
      0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b <br /> <br />
      <h4>Block Hash</h4>
      0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46 <br /> <br />
      <h4>Block Number</h4>
      3 <br /> <br />
      <h4>Campaign Address</h4>
      0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b <br /> <br />
      <h4>Cumulative Gas Used</h4>
      314159 wei <br /> <br /> <br />
      <button class="btn btn-lg btn-primary">Save Receipt</button>
    </div>
  </div>`;
};

module.exports = campaignContributeReceipt;
