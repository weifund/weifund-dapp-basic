import yo from 'yo-yo';
import { getDefaultAccount } from '../environment';
import { saveWalletFile, logout } from '../keystore';
import { getRouter } from '../router';

// main export
export default function accountView(options) {
  return yo`<div>
    <div id="view-account-restore" class="row center-block container"
      style=" display: none; margin-top: 8%;">
      <div class="col-xs-12 col-sm-8
        col-sm-offset-2 col-md-6
        col-md-offset-3 text-center">
        <h2>USING LIGHTWALLET</h2>

        <br />
        <br />

        <p>Please restore your wallet in order to manage your account.

          <br />
          <br />

          Warning: do not use or upload a wallet from sites like myetherwallet or any other wallet system.
          The WeiFund MVP only supports our own light-wallet configuration.
        </p>

        <br />

        <input type="file" style="display: none;" id="account-wallet-file" />

        <input id="account-wallet-seed" type="text" class="form-control"
          placeholder="WALLET SEED PHRASE" />

        <div class="row">
          <div class="col-xs-6">
            <input id="account-wallet-passphrase" type="password" class="form-control"
              placeholder="WALLET PASSPHRASE" style="display: none;" />
          </div>
          <div class="col-xs-6">
            <input id="account-wallet-passphrase-retype" type="password" class="form-control"
              placeholder="WALLET PASSPHRASE RE-TYPE" style="display: none;" />
          </div>
        </div>

        <br /><br />

        <div id="account-wallet-encrypt-buttons"
          style="display: none;">
          <a href="/account" class="btn btn-primary">
            RETRY
          </a>
          <input id="account-wallet-encrypt"
            type="submit"
            style="display: none;"
            value="ENCRYPT WALLET"
            class="btn btn-primary" />
        </div>

        <div id="account-wallet-buttons">
          <button type="button" id="account-wallet-restore" class="btn btn-primary">
            RESTORE FROM SEED
          </button>
            or
          <button type="button" id="account-wallet-upload" class="btn btn-primary">
            UPLOAD WALLET FILE
          </button>
        </div>

        <br /><br /><br />

        <div id="account-wallet-alert" style="display: none;"
          class="alert alert-info text-left">
          <p>Something happened</p>
        </div>
      </div>
    </div>

  <div id="view-account-panel" class="container-fluid"
    style="padding-left: 3%; padding-right: 3%; display: none;">

    <div class="row">
      <div class="col-sm-12 col-md-6" style="padding-right: 40px;">
        <h3>Token Holdings</h3>

        <div class="row">
          <div class="col-sm-12">
            <small>These are your balances of the known tokens.</small>
          </div>
        </div>

        <hr />

        <div id="tokens"></div>
      </div>

      <div class="col-sm-12 col-md-6" style="padding-left: 40px;">
        <div style="border: 1px solid #aaa; padding: 20px;">
          <h3 style="margin-top: 5px;">Account Details</h3>

          <div class="row col-sm-12">
            <p>These are your account details made available by the key provided.</p>
          </div>

          <div class="row" style="padding: 20px; border: 1px solidt #aaa;">
            <div class="col-sm-4 text-left" style="padding-top: 0px;">
              <h4>Address</h4>
              <h4>Balance<br /><small><br /></small></h4>
            </div>
            <div class="col-sm-8 text-left">
              <h4 style="text-overflow:ellipsis; overflow: hidden;">
                <a id="accountAddress"
                  href=${`http://etherscan.com/address/${getDefaultAccount()}`}
                  target="_blank"></a>
              </h4>
              <h4>
                <b><span id="accountBalanceEther">0</span></b> ether
                <br />
                <small><span id="accountBalanceWei">0</span> wei</small>
              </h4>
            </div>

            <br />
            <br />

            <button class="btn btn-primary" onclick=${saveWalletFile}>
              Download Encrypted Wallet
            </button>

            <button class="btn btn-primary" onclick=${() => {
              logout();
              getRouter()('/');
            }}>
              Logout
            </button>
          </div>
        </div>

        <br />

        <div class="row" style="padding: 20px;">
          <div style="padding: 20px; margin-bottom: 5px;
      background: #F1F1F1; border-bottom: 2px solid #999;">
            <h3 style="margin-top: 5px;">Send Ether</h3>

            <div class="row">
              <div class="col-xs-5">
                <label>To Address</label>
                <input class="form-control" id="sendAddress" placeholder="0x..." />
              </div>
              <div class="col-xs-3">
                <label>Value</label>
                <input type="number" class="form-control" id="sendAmount" placeholder="30 ether" />
              </div>
              <div class="col-xs-4">
                <label><br /></label><br />
                <button id="sendEther" class="btn btn-primary">Send Ether</button>
              </div>
            </div>

          </div>
        </div>

        <div id="account-send-tx-response" class="alert alert-info" style="display: none;">
        </div>

        <div class="row" style="padding: 20px;">
          <div style="padding: 20px; margin-bottom: 5px;
      background: #F1F1F1; border-bottom: 2px solid #999;">
            <h3 style="margin-top: 5px;">Claim Refund</h3>

            <div class="row">
              <div class="col-xs-5">
                <label>Campaign Address</label>
                <input class="form-control" id="refundCampaignAddress" placeholder="0x..." />
              </div>
              <div class="col-xs-3">
                <label>Cont. ID</label>
                <input type="number" class="form-control" id="refundCID" placeholder="1" />
              </div>
              <div class="col-xs-4">
                <label><br /></label><br />
                <button id="claimRefundOwed" class="btn btn-primary">
                  Claim Refund
                </button>
              </div>
            </div>

          </div>
        </div>

        <div id="account-claim-refund-response" class="alert alert-info" style="display: none;">
        </div>

      </div>
    </div>

  </div>
</div>`;
}
