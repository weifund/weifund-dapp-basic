import campaignContributeNav from './campaignContributeNav';

module.exports = campaignContributeWallet;

function campaignContributeWallet(options) {
  const t = options.t;
  const campaignObject = options.campaignObject;
  const defaultAccount = options.defaultAccount;

  return `
    <div id="view-campaign-contribute-wallet-balance" class="row center-block container" style=" display: none; margin-top: 40px;">

      <h2>USING LIGHTWALLET</h2>

      <br />
      <br />

      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-4">
          <canvas id="campaign-contribute-qrcode" style="border: 3px solid #333; padding: 20px;"></canvas>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-8">
          <h2 class="text-break-all">
            <label>Address</label><br />
            0x6e0e6d45820d91356fc73d7ff2bdef353ebfe7e9
          </h2>

          <hr />

          <h4>This is the QR code for your wallet address.</h4>

          <h4>Please fill your account with Ether, so you can contribute to the campaign.</h4>

          <br />

          <div class="row">
            <div class="col-sm-6">
              <h4 style="margin-top: 0px;"><b>Balance</b></h4>
              <h3 style="margin-top: 0px;">0 ether</h3>
            </div>
            <div class="col-sm-6"><br />
              <a href="/campaign/${campaignObject.id}/contribute/form" disabled class="btn btn-primary">CONTRIBUTE TO CAMPAIGN</a>
            </div>
          </div>

        </div>
      </div>
      ${campaignContributeNav({backURL: `/campaign/${campaignObject.id}/contribute/wallet`, showNextButton: false})}
    </div>

    <div id="view-campaign-contribute-wallet-download" class="row center-block container" style=" display: none; margin-top: 40px;">

      <h2>USING LIGHTWALLET</h2>

      <br />
      <br />

      <p>We recommend you save a backup of your wallet on your local computer.</p>

      <br />

      <a href="/campaign/${campaignObject.id}/contribute/wallet/balance" class="btn btn-primary">DOWNLOAD ENCRYPTED WALLET</a>

      <a href="/campaign/${campaignObject.id}/contribute/wallet/balance" class="btn btn-primary">NO, THANKS</a>

    </div>

    <div id="view-campaign-contribute-wallet-password" class="row center-block container" style=" display: none; margin-top: 40px;">

      <h2>USING LIGHTWALLET</h2>

      <br />
      <br />

      <h4>Your seed is:</h4>

      <div class="alert alert-warning text-center">
        <h3 style="margin-top: 0px; margin-bottom: 0px;">maze broom course magnet lady abandon put stove rhythm bag short speed</h3>
      </div>

      <h4>
        <b>REMEMBER TO WRITE DOWN YOUR SEED</b>
        You will need this in case you lose your wallet.
      </h4>

      <h4>
        This lightwallet is still in beta and is presently not recommended for the storage of large amounts of ETH.
      </h4>

      <h4>
        Please enter a password to securely encrypt your wallet.
      </h4>

      <br /><br />

      <div>
        <input type="password" class="form-control" placeholder="PASSWORD" />

        <br />

        <input type="password" class="form-control" placeholder="VERIFY PASSWORD" />
      </div>

      <br /><br />

      <a href="/campaign/${campaignObject.id}/contribute/wallet/confirm" class="btn btn-primary">CREATE WALLET</a>

      ${campaignContributeNav({backURL: `/campaign/${campaignObject.id}/contribute/wallet`, showNextButton: false})}
    </div>

    <div id="view-campaign-contribute-wallet-entropy" class="row center-block container" style=" display: none; margin-top: 40px;">

      <h2>USING LIGHTWALLET</h2>

      <br />
      <br />

      <h4>Please move your mouse to add entropy to the seed generation.</h4>

      <br />


      <a href="/campaign/${campaignObject.id}/contribute/wallet/password">
        <div style="width: 100%; height: 15px; background: #F1F1F1;">
          <div style="width: 65%; height: 15px; background: #ff7518"></div>
        </div>
      </a>

      ${campaignContributeNav({backURL: `/campaign/${campaignObject.id}/contribute/wallet`, showNextButton: false})}
    </div>

    <div id="view-campaign-contribute-wallet-confirm" class="row center-block container" style=" display: none; margin-top: 40px;">

      <h2>USING LIGHTWALLET</h2>

      <br />
      <br />

      <p>Please re-enter your wallet seed</p>

      <br />

      <input type="text" class="form-control" placeholder="WALLET SEED PHRASE" />

      <br />

      <a href="/campaign/${campaignObject.id}/contribute/wallet/download" class="btn btn-primary">CONFIRM SEED PHRASE</a>

      ${campaignContributeNav({backURL: `/campaign/${campaignObject.id}/contribute/wallet`, showNextButton: false})}
    </div>

    <div id="view-campaign-contribute-wallet-restore" class="row center-block container" style=" display: none; margin-top: 40px;">

      <h2>USING LIGHTWALLET</h2>

      <br />
      <br />

      <input type="text" class="form-control" placeholder="WALLET SEED PHRASE" />

      <br />

      <a class="btn btn-primary">RESTORE FROM SEED</a>
        or
      <a class="btn btn-primary">UPLOAD WALLET FILE</a>

      ${campaignContributeNav({backURL: `/campaign/${campaignObject.id}/contribute/wallet`, showNextButton: false})}
    </div>

    <div id="view-campaign-contribute-wallet" class="row center-block container"
        style="margin-top: 40px; display: none;">

      <h2>USING LIGHTWALLET</h2>

      <br />
      <br />

      <h4>Please watch our instructional video on how to
    generate, use and restore your SingularDTV Lightwallet.</h4>

      <h4><b>DISCLAIMER</b>
      This lightwallet is still in beta and is presently not recommended for the storage of large amounts of ETH.</h4>

      <h4>If you created an account before, enter your seed below or open a wallet.
      Click on "Generate" to create a new account.</h4>

      <br /><br />

      <div>
        <a href="/campaign/${campaignObject.id}/contribute/wallet/entropy" class="btn btn-primary">
          GENERATE
        </a>
        <a href="/campaign/${campaignObject.id}/contribute/wallet/restore" class="btn btn-primary">
          RESTORE
        </a>
      </div>

      ${campaignContributeNav({backURL: `/campaign/${campaignObject.id}`, showNextButton: false})}
    </div>`;
}
