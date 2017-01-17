import yo from 'yo-yo';
import { getDefaultAccount } from '../environment';

// main export
export default function accountView(options) {
  return yo`<div>
    <div id="view-account-restore" class="row center-block container"
      style=" display: none; margin-top: 8%;">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 text-center">
        <h2>USING LIGHTWALLET</h2>

        <br />
        <br />

        <p>Please restore your wallet in order to manage your account.</p>

        <br />

        <input id="account-wallet-seed" type="text" class="form-control"
          placeholder="WALLET SEED PHRASE" />

        <input id="account-wallet-passphrase" type="text" class="form-control"
            placeholder="WALLET PASSPHRASE" style="display: none;" />

        <input type="file" style="display: none;" id="account-wallet-file" />

        <br /><br />

        <div id="account-wallet-buttons">
          <button id="account-wallet-restore" class="btn btn-primary">RESTORE FROM SEED</button>
            or
          <button id="account-wallet-upload" class="btn btn-primary">UPLOAD WALLET FILE</button>
        </div>


        <br /><br /><br />

        <div id="account-wallet-alert" class="alert alert-info text-left">
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

        <br />
        <br />
        <br />
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
              <h4>Provider</h4>
            </div>
            <div class="col-sm-8 text-left">
              <h4 style="text-overflow:ellipsis; overflow: hidden;">
                <a id="accountAddress"
                  href=${`http://etherscan.com/address/${getDefaultAccount()}`}
                  target="_blank"></a>
              </h4>
              <h4>
                <b><span id="accountBalanceEther">0</span></b> ether (approx. $0,000 USD)
                <br />
                <small><span id="accountBalanceWei">0</span> wei</small>
              </h4>
              <h4>Hooked Web3 Provider (via <a href="https://infura.io" target="_blank">
                infura.io
              </a>)</h4>
            </div>
          </div>
        </div>

        <br />

        <hr />

        <div class="row" style="padding: 20px;">
          <div style="border: 1px solid #aaa; padding: 20px;">
            <h3 style="margin-top: 5px;">Send Ether</h3>

            <div class="row">
              <div class="col-xs-5">
                <label>To Address</label>
                <input class="form-control" id="sendAddress" placeholder="0x..." />
              </div>
              <div class="col-xs-3">
                <label>Value</label>
                <input class="form-control" id="sendAmount" placeholder="30 ether" />
              </div>
              <div class="col-xs-4">
                <label><br /></label><br />
                <button id="sendEther" class="btn btn-primary">Send Ether</button>
              </div>
            </div>

          </div>
        </div>

        <div class="alert alert-info">
          <h3 style="margin-top: 0px;">Transaction Processing</h3>
          <p>Your transaction is being processed.</p>
          <hr />
          <label>Transaction Hash</label>
          <h4>
            <a href="https://etherscan.com/tx/0x" target="_blank" style="color: #FFF;">
              0x....
            </a>
          </h4>
        </div>

      </div>
    </div>

  </div>
</div>`;
}
