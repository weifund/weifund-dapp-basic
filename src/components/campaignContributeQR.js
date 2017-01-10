import campaignContributeNav from './campaignContributeNav';

// export method
module.exports = campaignContributeQR;

// main export
function campaignContributeQR(options) {
  const t = options.t;

  return `<div id="view-campaign-contribute-ether-qrcode" class="row center-block container" style=" margin-bottom: 150px;">
    <div class="col-xs-12">
      <h3>Campaign QR Code</h3>
      <br />
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-4">
          <canvas id="campaign-contribute-qrcode" style="border: 3px solid #333; padding: 20px;"></canvas>
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
    ${campaignContributeNav({backURL: `/campaign/${options.campaignObject.id}/contribute/ether`, showNextButton: false})}
  </div>
  `;
}
