import yo from 'yo-yo';
import { keyStore } from 'eth-lightwallet';
import store from 'store';
import { log, etherScanAddressUrl, etherScanTxHashUrl, oneDay, emptyWeb3Address } from 'weifund-util';
import Contracts from 'weifund-contracts';
import BigNumber from 'bignumber.js';

import { el } from '../document';
import { setDefaultAccount, getDefaultAccount, getCampaign, setCampaign,
  getNetwork, getLocale, getContractEnvironment, txObject } from '../environment';
import { viewLoader, accountView } from '../components';
import { web3, getTransactionSuccess } from '../web3';
import { ipfs } from '../ipfs';
import { refreshPageButtons, getRouter } from '../router';
import { t } from '../i18n';
import { createEncryptedKeystore, setKeystore, setWalletProvider } from '../keystore';

const contracts = new Contracts(getContractEnvironment(), web3.currentProvider);
const IssuedToken = contracts.IssuedToken.factory;
const Model1Enhancer = contracts.Model1Enhancer.factory;


function TokenUI(options) {
  return yo`<div>
<div class="row" style="padding-left: 15px; padding-right: 15px;">
  <div class="col-sm-12"
    style="padding: 20px; margin-bottom: 5px;
      background: #F1F1F1; border-bottom: 2px solid #999;">
    <div class="row">
  <div class="col-sm-12">
    <h3 class="row">
      <div class="col-xs-6">
        ${options.name}
        <small>(${options.symbol})</small>
      </div>
      <div class="col-xs-6 text-right">
        <a href=${`http://etherscan.io/address/${options.tokenAddress}`}
          target="_blank"
          style="text-overflow:ellipsis;
          overflow: hidden; display: inline-block; width: 100px;">
          ${options.tokenAddress}
        </a>
      </div>
    </h3>
    <div class="row">
      <div class="col-xs-6">
        <h4>
          Supply ${options.totalSupply.toString(10)}
          | Issued ${options.tokensIssued.toString(10)}
        </h4>
      </div>
      <div class="col-xs-6 text-right">
        <h4>
          Status <i>${options.claimed && 'claimed' || 'unclaimed'}</i>
        </h4>
      </div>
    </div>

    <hr />

    <div class="row">
      <div class="col-sm-6 text-left">
        <h4>
          ${options.hasTokensOwed && options.tokensOwed.toString(10) || ''}
          ${options.claimed && options.accountTokenBalance.toString(10) || ''}
          <small>${options.symbol}</small>
          <small>v${options.version}</small>
        </h4>
      </div>
      <div class="col-sm-6 text-right">
        <button class="btn btn-primary"
          style=${options.claimed && 'display: inline-block' || 'display: none;'}
          onclick=${() => {
            if(el(`#tokenTransferWindow_${options.tokenAddress}`).style.display === 'block') {
              el(`#tokenTransferWindow_${options.tokenAddress}`).style.display = 'none';
            } else {
              el(`#tokenTransferWindow_${options.tokenAddress}`).style.display = 'block';
            }
          }}>
          Transfer
        </button>
        <button class="btn btn-success
          ${!options.canClaim && 'disabled' || ''}"
          onclick=${() => {
            if (options.canClaim) {
              options.enhancer.claim((err, result) => {
                console.log(err, result);
              });
            } else {
              console.log('cant claim!');
            }
          }}>
          Claim
        </button>
      </div>
    </div>

    <div class="row" id=${`tokenTransferWindow_${options.tokenAddress}`}
      style="display: none;">
      <div class="col-sm-12">
        <hr />
      </div>

      <div class="col-sm-5">
        <input type="text" id=${`tokenTransferAccount_${options.tokenAddress}`}
        placeholder="address"
          class="form-control"  />
      </div>

      <div class="col-sm-4 col-md-4 col-lg-4">
        <input type="number" id=${`tokenTransferAmount_${options.tokenAddress}`}
        placeholder="token amount"
          class="form-control" />
      </div>

      <div class="col-sm-3 text-right">
        <button id="transferToken" class="btn btn-primary">
          Transfer Amount
        </button>
      </div>
    </div>
  </div>
</div></div></div>
  <div class="row" style=${options.canClaim
    && 'display: inline-block; padding: 16px;'
    || 'display: none; padding: 16px;'}>
    <div class="col-xs-12 alert alert-info">
      Please claim your tokens owed here by clicking 'Claim'.
    </div>
  </div>
</div>`;
}

function loadTokenFromEnhancer(enhancerAddress) {
  const enhancer = Model1Enhancer.at(enhancerAddress);

  web3.eth.getBlockNumber((err, blockNumber) => {
    enhancer.token((err, tokenAddress) => {
      enhancer.balanceOf(getDefaultAccount(), (err, tokensOwed) => {
        enhancer.startBlock((err, startBlock) => {
          enhancer.tokensIssued((err, tokensIssued) => {
            enhancer.freezePeriod((err, freezePeriod) => {
              enhancer.claimed(getDefaultAccount(), (err, claimed) => {
                const token = IssuedToken.at(tokenAddress);
                let canClaim = false;
                let hasTokensOwed = false;

                console.log(tokensOwed.toString(10));

                // the user can claim the tokens
                if (new BigNumber(blockNumber).gte(startBlock.add(freezePeriod))
                  && !claimed) {
                  canClaim = true;
                }

                if (tokensOwed.gt(0)) {
                  hasTokensOwed = true;
                }

                token.name((err, name) => {
                  token.balanceOf(getDefaultAccount(), (err, accountTokenBalance) => {
                    token.decimals((err, decimals) => {
                      token.totalSupply((err, totalSupply) => {
                        token.symbol((err, symbol) => {
                          token.version((err, version) => {
                            el('#tokens').appendChild(TokenUI({
                              enhancerAddress,
                              name,
                              decimals,
                              canClaim,
                              hasTokensOwed,
                              blockNumber,
                              tokensOwed,
                              totalSupply,
                              symbol,
                              version,
                              accountTokenBalance,
                              tokenAddress,
                              tokensIssued,
                              startBlock,
                              freezePeriod,
                            }));
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function loadAccount() {
  // route to panel page
  getRouter()('/account/panel');

  // get accounts
  web3.eth.getAccounts((err, accounts) => {
    if (!accounts) {
      accounts = ['0xc5b14f77554e4d6f1060b2d95f26a31191bd46c9'];
    }

    // set accont address on the page
    el('#accountAddress').innerHTML = '';
    el('#accountAddress').appendChild(yo`<span>${accounts[0]}</span>`);

    web3.eth.getBalance(accounts[0], (err, accountBalance) => {
      const balance = accountBalance || '0';
      el('#accountBalanceEther').innerHTML = '';
      el('#accountBalanceWei').innerHTML = '';
      el('#accountBalanceEther').appendChild(yo`<span>${web3.fromWei(balance, 'ether').toString(10)}</span>`);
      el('#accountBalanceWei').appendChild(yo`<span>${web3.fromWei(balance, 'wei').toString(10)}</span>`);
    });

    // load token at this address
    loadTokenFromEnhancer('0x2ac0f0eb919e28c9d33518f48f9565796c84d69e');

    // refresh page buttons
    refreshPageButtons();
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
    createEncryptedKeystore(walletSeed, '').then((keystore) => {
      setKeystore(keystore);
      setWalletProvider(keystore);

      setTimeout(() => loadAccount(), 30);
    });
  } else {
    el('#account-wallet-alert').innerHTML = '';
    el('#account-wallet-alert').appendChild(yo`<p>You must enter a seed or upload your encrypted wallet file.</p>`);
  }
}

// draw account page
export default function loadAndDrawAccount(callback) {
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
