import yo from 'yo-yo';

// requires
import { keyStore } from 'eth-lightwallet';
import store from 'store';

// utils
import { log, etherScanAddressUrl, parseSolidityMethodName,
  etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';

// document helper
import { el } from '../document';

// env
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';

// components
import { viewLoader, accountView } from '../components';

// web3
import { web3 } from '../web3';
import { ipfs } from '../ipfs';
import { refreshPageButtons, getRouter } from '../router';
import { t } from '../i18n';

// Contracts
import Contracts from 'weifund-contracts';
const contracts = new Contracts(getContractEnvironment(), web3.currentProvider);
const IssuedToken = contracts.IssuedToken.factory;

// export module
module.exports = loadAndDrawAccount;

// load account
function loadAccount() {
  // route to panel page
  getRouter()('/account/panel');

  // get accounts
  web3.eth.getAccounts((err, accounts) => {
    if (!accounts) {
      accounts = ['0xc5b14f77554e4d6f1060b2d95f26a31191bd46c9'];
    }

    el('#accountAddress').innerHTML = '';
    el('#accountAddress').appendChild(yo`<span>${accounts[0]}</span>`);

    web3.eth.getBalance(accounts[0], (err, accountBalance) => {
      const balance = accountBalance || '0';
      el('#accountBalanceEther').innerHTML = '';
      el('#accountBalanceWei').innerHTML = '';
      el('#accountBalanceEther').appendChild(yo`<span>${web3.fromWei(balance, 'ether').toString(10)}</span>`);
      el('#accountBalanceWei').appendChild(yo`<span>${web3.fromWei(balance, 'wei').toString(10)}</span>`);
    });

    loadToken('0x1c79ee86aa0720eb7a5a77d0cb715c489850f421');

    refreshPageButtons();

    function loadToken(addr) {
      const token = IssuedToken.at(addr);

      token.name((err, name) => {
        token.balanceOf(accounts[0], (err, accountTokenBalance) => {
          token.decimals((err, decimals) => {
            token.totalSupply((err, totalSupply) => {
              token.symbol((err, symbol) => {
                token.version((err, version) => {
                  el('#tokens').appendChild(yo`<div class="row">
                  <div class="col-sm-12">
                    <h3>${name} <small>(${symbol})</small></h3>
                    <div class="row">
                      <div class="col-sm-4">
                        <h4 style="text-overflow:ellipsis; overflow: hidden; width: 100px;">
                          ${token.address}
                        </h4>
                      </div>
                      <div class="col-sm-2">
                       <h4> v${version} </h4>
                      </div>
                      <div class="col-sm-6">
                        <h4>
                          total supply ${totalSupply.toString(10)}
                        </h4>
                      </div>
                    </div>

                    <hr />

                    <div class="row">
                      <div class="col-sm-6 text-left">
                        <h4>${accountTokenBalance.toString(10)} <small>${symbol}</small></h4>
                      </div>
                      <div class="col-sm-6 text-right">
                        <button id="openTransferBriad" class="btn btn-primary">Transfer</button>
                        <button id="openDebitBriad" class="btn btn-primary">Debit</button>
                        <button id="claimBriad" class="btn btn-success">Claim</button>
                      </div>
                    </div>

                    <div class="row" id="briadDebitWindow" style="display: none;">
                      <div class="col-sm-12">
                        <hr />
                      </div>

                      <div class="col-sm-5">
                        <input type="text" id="braidDebitAccount" placeholder="address"
                          class="form-control"  />
                      </div>

                      <div class="col-sm-4 col-md-4 col-lg-4">
                        <input type="number" id="braidDebitAmount" placeholder="token amount"
                          class="form-control" />
                      </div>

                      <div class="col-sm-3 text-right">
                        <button id="debitBriad" class="btn btn-primary">Debit Amount</button>
                      </div>
                    </div>

                    <div class="row" id="briadTransferWindow" style="display: none;">
                      <div class="col-sm-12">
                        <hr />
                      </div>

                      <div class="col-sm-5">
                        <input type="text" id="braidTransferAccount" placeholder="address"
                          class="form-control"  />
                      </div>

                      <div class="col-sm-4 col-md-4 col-lg-4">
                        <input type="number" id="braidTransferAmount" placeholder="token amount"
                          class="form-control" />
                      </div>

                      <div class="col-sm-3 text-right">
                        <button id="transferBriad" class="btn btn-primary">Transfer Amount</button>
                      </div>
                    </div>
                  </div>
                  </div>`);

                  var open = 'none';

                  function updateTransferWindows(openWindow) {
                    if (openWindow === open) {
                      openWindow = 'none';
                    }

                    if (openWindow == 'none') {
                      el('#briadTransferWindow').style.display = 'none';
                      el('#briadDebitWindow').style.display = 'none';
                    } else if (openWindow == 'transfer') {
                      el('#briadTransferWindow').style.display = 'block';
                      el('#briadDebitWindow').style.display = 'none';
                    } else if (openWindow == 'debit') {
                      el('#briadTransferWindow').style.display = 'none';
                      el('#briadDebitWindow').style.display = 'block';
                    }

                    open = openWindow;
                  }

                  el('#openTransferBriad').onclick = () => {
                    updateTransferWindows('transfer');
                  };

                  el('#openDebitBriad').onclick = () => {
                    updateTransferWindows('debit');
                  };

                  el('#transferBriad').onclick = () => {
                    const transferAccount = el('#braidTransferAccount').value;
                    const transferAmount = el('#braidTransferAmount').value;

                    token.transfer(transferAccount, transferAmount, { from: accounts[0], gas: 3000000 }, (err, result) => {
                      console.log('trasfer!');
                    });
                  };

                  el('#debitBriad').onclick = () => {
                    const debitAccount = el('#braidDebitAccount').value;
                    const debitAmount = el('#braidDebitAmount').value;

                    token.approve(debitAccount, () => {
                      console.log('approve!');
                    });
                  };
                });
              });
            });
          });
        });
      });
    }
  });
}

// load wallet
function loadWallet() {
  // handle wallet seed
  const walletSeed = el('#account-wallet-seed').value;
  const walletFile = el('#account-wallet-file').files[0];
  const walletPassphrase = el('#account-wallet-passphrase').value;

  if (walletFile) {
    var reader = new FileReader();
    reader.onload = (e) => {
      // e.target.result
      // display passphrase box

      loadAccount();
    };
    reader.readAsText(walletFile);
  } else if (walletSeed) {
    loadAccount();
  } else {
    el('#account-wallet-alert').innerHTML = '';
    el('#account-wallet-alert').appendChild(yo`<p>You must enter a seed or upload your encrypted wallet file.</p>`);
  }
}

// draw account page
function loadAndDrawAccount(callback) {
  // draw loader
  el('#view-focus').innerHTML = '';
  el('#view-focus').appendChild(viewLoader({ t }));

  el('#view-account').innerHTML = '';
  el('#view-account').appendChild(accountView({}));

  el('#account-wallet-file').addEventListener('change', () => {
    el('#account-wallet-seed').style.display = 'none';
    el('#account-wallet-passphrase').style.display = 'block';
  });
  el('#account-wallet-restore').addEventListener('click', loadWallet);
  el('#account-wallet-upload').addEventListener('click', () => {
    el('#account-wallet-file').click();
  });

  callback(null, true);
}
