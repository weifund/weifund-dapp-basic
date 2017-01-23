import yo from 'yo-yo';

// get nav
import campaignContributeNav from './campaignContributeNav';
import { logout } from '../keystore';

// main export
export default function campaignContributeWallet(options) {
  const t = options.t;
  const campaignObject = options.campaignObject;
  const defaultAccount = options.defaultAccount;

  return yo`<div>
    <div id="view-campaign-contribute-wallet-balance" class="row center-block container"
      style=" display: none; margin-top: 10px;">

      <h2>YOUR LIGHTWALLET</h2>

      <br />
      <br />

      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-4">
          <canvas id="campaign-contribute-qrcode" style="border: 3px solid #333; padding: 20px; display: none;">
          </canvas>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-8">
          <h2 class="text-break-all" style="position: relative;">
            <label>Address</label><br />
            <span class="user-address">Loading... please <a href=${`/campaign/${campaignObject.id}/contribute/wallet/restore`}>retry</a> if this doesn't load within several seconds</span>
          </h2>

          <hr />

          <h4>This is the QR code for your wallet address. Mobile Ethereum apps can scan this code to send ether to your address.</h4>

          <h4><b class="text-warning">Please fill your account with Ether</b>, so you can contribute to the campaign. Minimum <b>0.125 ether</b> balance required.</h4>

          <br />

          <div class="row">
            <div class="col-sm-6">
              <h4 style="margin-top: 0px;"><b>Balance</b></h4>
              <h3 style="margin-top: 0px;"><span class="account-balance">0</span> ether</h3>
            </div>
            <div class="col-sm-6 text-right"><br />
              <button id="campaign-contribute-to-campaign"
                class="contribute btn btn-primary"
                disabled>
                CONTRIBUTE TO CAMPAIGN
              </button>
            </div>
          </div>

        </div>
      </div>
      ${campaignContributeNav({
        backURL: `/campaign/${campaignObject.id}/contribute/wallet`,
        showNextButton: false,
      })}
    </div>

    <div id="view-campaign-contribute-wallet-download" class="row center-block container"
      style=" display: none; margin-top: 10px;">

      <h2>YOUR LIGHTWALLET</h2>

      <br />
      <br />

      <h4>
        We recommend you <b>save a backup of your wallet</b> on your local
        computer. Your backup file will be encrypted with the password you
        entered.
      </h4>

      <br />

      <a class="download btn btn-primary">
        DOWNLOAD ENCRYPTED WALLET
      </a>

      <a href="/campaign/${campaignObject.id}/contribute/wallet/balance" class="btn btn-primary">
        NO, THANKS
      </a>

      ${campaignContributeNav({
        backURL: `/campaign/${campaignObject.id}/contribute/wallet`,
        showNextButton: false,
      })}
    </div>

    <div id="view-campaign-contribute-wallet-seed" class="row center-block container"
      style=" display: none; margin-top: 10px;">

      <h2>YOUR LIGHTWALLET</h2>

      <br />
      <br />

      <h4>
        Your
        <span data-tooltip="A seed phrase is a verbal representation of your account's private key, a very large, randomly selected number.">
          seed phrase
        </span>
        is:
      </h4>

      <div class="alert alert-warning text-center">
        <h3 class="seed" style="-webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -o-user-select: none;
          user-select: none;
          cursor: default;
          margin-top: 0px;
          margin-bottom: 0px;">
          Loading...
        </h3>
      </div>

      <h4>
        <b>WRITE DOWN YOUR SEED PHRASE.</b>
        WeiFund does not store your wallet. Your seed phrase is required to
        access your assets.
      </h4>

      <br /><br />

      <a href="/campaign/${campaignObject.id}/contribute/wallet/confirm" class="btn btn-primary">
        I WROTE IT DOWN
      </a>

      ${campaignContributeNav({
        backURL: `/campaign/${campaignObject.id}/contribute/wallet`,
        showNextButton: false,
      })}
    </div>

    <div id="view-campaign-contribute-wallet-entropy" class="row center-block container"
      style=" display: none; margin-top: 10px;">

      <h2>YOUR LIGHTWALLET</h2>

      <br />
      <br />

      <h4><b>Move your mouse randomly</b> to generate your new wallet.</h4>

      <br />

      <div style="width: 100%; height: 15px; background: #F1F1F1;">
        <div class="progress" style="width: 0; height: 15px; background: #ff7518"></div>
      </div>

      ${campaignContributeNav({
        backURL: `/campaign/${campaignObject.id}/contribute/wallet`,
        showNextButton: false,
      })}
    </div>

    <div id="view-campaign-contribute-wallet-confirm" class="row center-block container"
      style=" display: none; margin-top: 10px;">

      <h2>YOUR LIGHTWALLET</h2>

      <br />
      <br />

      <p>Please <b>re-enter your wallet seed</b> to verify that your backup is correct.</p>

      <br />

      <input type="text"
        id="wallet-seed-phrase-confirm"
        class="form-control"
        placeholder="WALLET SEED PHRASE" />

      <br />

      <a disabled id="wallet-seed-confirm" class="confirm btn btn-primary">
        CONFIRM SEED PHRASE
      </a>

      ${campaignContributeNav({
        backURL: `/campaign/${campaignObject.id}/contribute/wallet`,
        showNextButton: false,
      })}
    </div>

    <div id="view-campaign-contribute-wallet-password" class="row center-block container"
      style=" display: none; margin-top: 10px;">

      <h2>YOUR LIGHTWALLET</h2>

      <br />
      <br />

      <h4>
        Seed phrases are unencrypted, but WeiFund encrypts your in-app
        lightwallet with a password that you'll need to enter before the app
        can access your assets. Choose a password to protect your lightwallet
        from unauthorized access.
      </h4>

      <h4>
        <b>Note, Strong passwords contain upper case letters,
        lower case letters, numbers, and special characters.</b>
        Using dictionary words in your password makes it weaker.
      </h4>

      <br />

      <form>
        <input name="password-1" type="password" class="form-control" placeholder="ENTER PASSWORD" />
        <br />
        <input name="password-2" type="password" class="form-control" placeholder="REPEAT PASSWORD" />
        <br />
        <input type="submit" id="encrypt-wallet-button" disabled value="ENCRYPT" class="encrypt btn btn-primary" />
      </form>

      ${campaignContributeNav({
        backURL: `/campaign/${campaignObject.id}/contribute/wallet`,
        showNextButton: false,
      })}
    </div>


    <div id="view-campaign-contribute-wallet-restore" class="row center-block container"
      style=" display: none; margin-top: 10px;">

      <h2>YOUR LIGHTWALLET</h2>

      <br />
      <br />

      <p>
        Warning: do not use or upload a wallet from sites like myetherwallet or any other wallet system.
        The WeiFund MVP only supports our own light-wallet configuration.
      </p>

      <br />
      <br />

      <input type="text" class="form-control" placeholder="WALLET SEED PHRASE" />
      <input type="file" style="display: none" />

      <br />

      <a id="campaign-wallet-metamask" class=" btn btn-primary">METAMASK</a>
      <a class="restore btn btn-primary">RESTORE FROM SEED</a>
      <a class="open-file btn btn-primary">OPEN WALLET FILE</a>

      <div class="alert alert-warning row center-block container"
        id="campaign-contribute-wallet-error"
        style="display: none; margin-top: 20px; margin-bottom: 0px;">
      </div>

      ${campaignContributeNav({
        backURL: `/campaign/${campaignObject.id}/contribute/wallet`,
        showNextButton: false,
      })}
    </div>

    <div id="view-campaign-contribute-wallet" class="row center-block container"
        style="margin-top: 10px; display: none;">

      <h2>YOUR LIGHTWALLET</h2>

      <br />
      <br />

      <h4>
        <b>DISCLAIMER</b>
        This lightwallet is still in beta and is presently not recommended for
        the storage of large amounts of ETH.
      </h4>

      <br />

      <h4>
        You can create a new Ethereum <i>Lightwallet</i> wallet to contribute to a campaign or use
        an existing wallet if you already have one.
      </h4>

      <br />

      <h4>
        Please <b>do not refresh the page</b> at any point while making your contribution.
      </h4>

      <br /><br />

      <div>
        <a href="/campaign/${campaignObject.id}/contribute/wallet/entropy"
          onclick=${logout}
          class="generate btn btn-primary">
          NEW WALLET
        </a>
        <a href="/campaign/${campaignObject.id}/contribute/wallet/restore"
          onclick=${logout}
          class="btn btn-primary">
          EXISING WALLET
        </a>
      </div>

      ${campaignContributeNav({
        backURL: `/campaign/${campaignObject.id}`,
        showNextButton: false,
      })}
    </div>
</div>`;
}
