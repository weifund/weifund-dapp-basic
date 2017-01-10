// export method
module.exports = campaignFocusContractsView;

// main export
function campaignFocusContractsView(options) {
  const t = options.t;

  return `<div id="view-campaign-qr" class="bg-white container row center-block" style="display: none;">
    <div class="col-xs-12">
      <h3>Campaign QR Code</h3>
      <br />
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-4">
          <canvas id="campaign_qrcode" style="min-height: 250px; border: 3px solid #333; padding: 20px;"></canvas>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-8">
          <h2 class="text-break-all">
            ${options.campaignObject.addr}
          </h2>
          <hr />
          <h4>This is the QR code for this campaign's address.</h4>
          <br />
          <br />
          <h4>Warning: some campaigns may not service the QR code method. Please check with the campaign provider before sending ether to the campaign via a QR code.</h4>
        </div>
      </div>
    </div>
  </div>`;
}
