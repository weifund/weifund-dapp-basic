// requires
const QRious = require('qrious');

// utils
const utils = require('./utils/');
const log = utils.log;
const etherScanAddressUrl = utils.etherScanAddressUrl;
const etherScanTxHashUrl = utils.etherScanTxHashUrl;
const parseCampaignRegistryData = utils.parseCampaignRegistryData;
const buildInputsArray = utils.buildInputsArray;
const parseSolidityMethodName = utils.parseSolidityMethodName;
const parseSolidityMethodInterface = utils.parseSolidityMethodInterface;
const oneDay = utils.oneDay;
const filterXSSObject = utils.filterXSSObject;

// view handling
const views = require('./views');
const closeAllViews = views.closeAllViews;
const openView = views.openView;

// environment
const environment = require('./environment');
const getNetwork = environment.getNetwork;
const getLocale = environment.getLocale;
const getContractEnvironment = environment.getContractEnvironment;
const txObject = environment.txObject;
const getDefaultAccount = environment.getDefaultAccount;
const setDefaultAccount = environment.setDefaultAccount;

// campaign environment methods
const getCampaign = environment.getCampaign;
const setCampaign = environment.setCampaign;
const getCampaigns = environment.getCampaigns;

// web3
const web3 = require('./web3').web3;

// ipfs instance
const ipfs = require('./ipfs').ipfs;

// require contracts
// setup campaign and data registries
// Campaign/token contracts
const contracts = require('./contracts');
const campaignRegistry = contracts.campaignRegistryContract;
const staffPicks = contracts.staffPicksContract;
const campaignDataRegistry = contracts.campaignDataRegistryContract;
const standardCampaignFactory = contracts.standardCampaignContractFactory;
const campaign = contracts.campaignContractFactory;

// loadCampaign method
const lib = require('./lib');
const getCampaignData = lib.getCampaign;
const getCampaignsData = lib.getCampaigns;

// router instance
var router = require('./router');
const getRouter = router.getRouter;
const refreshPageButtons = router.refreshPageButtons;

// require i18n
const t = require('./i18n').t;

// the draw nav function
const drawNav = function() {
  document.querySelector('#nav').innerHTML += `
    <!-- <a href="/">${t("app.nav.weifund")}</a> -->
    <a href="/">${t("app.nav.campaigns")}</a>
    <!-- <a href="/start">${t("app.nav.start")}</a>
    <a href="/register">${t("app.nav.register")}</a>
    <a href="/account">${t("app.nav.account")}</a> -->
  `;
};

// handle new campaign creation
const handleNewCampaign = function(){
  const name = document.querySelector('#newCampaign_name').value;
  const beneficiary = document.querySelector('#newCampaign_beneficiary').value;
  const expiry = Math.round((new Date()).getTime() / 1000) + (parseInt( document.querySelector('#newCampaign_expiry').value) * 86400);
  const fundingGoal = web3.toWei(document.querySelector('#newCampaign_fundingGoal').value, 'ether');
  const newStandardCampaignTxObject = Object.assign({data: classes.StandardCampaign.bytecode}, txObject());
  const confirmMessage = `
  Are you sure you want to create a StandardCampaign with these details:

  Name:
  ${name}

  Beneficiary:
  ${beneficiary}

  Expiry (unix):
  ${expiry}

  Funding Goal (wei):
  ${fundingGoal}
  `;

  if (confirm(confirmMessage)) {

    // awaiting approval
    document.querySelector('#newCampaign_response').innerHTML = `Your new StandardCampaign transaction is awaiting approval...`;

    // new standard campaign tx
    standardCampaignFactory.new(name, expiry, fundingGoal, beneficiary,  newStandardCampaignTxObject, function(newStandardCampaignError, newStandardCampaignResult){
      // handle new standard campaign error
      if (newStandardCampaignError) {
        document.querySelector('#newCampaign_response').innerHTML = `There was an error while creating your new campaign: ${JSON.stringify(newStandardCampaignError, null, 2)}`;
      }

      // contract created
      if (newStandardCampaignResult.address) {
        document.querySelector('#newCampaign_response').innerHTML = `Your new WeiFund standard campaign contract was created at address: ${newStandardCampaignResult.address} with transaction hash: ${newStandardCampaignResult.transactionHash}
        <br />
        <a href="${etherScanTxHashUrl(newStandardCampaignResult.transactionHash, getNetwork())}" target="_blank">etherscan</a>
        `;

        // print receipt as well
        web3.eth.getTransactionReceipt(newStandardCampaignResult.transactionHash, function(newCampaignReceiptError, newCampaignReceiptResult){
          if (!newCampaignReceiptError) {
            document.querySelector('#newCampaign_response').innerHTML += `
            Transaction Receipt:
            ${JSON.stringify(newCampaignReceiptResult, null, 2)}
            <br />
            <a href="${etherScanTxHashUrl(newStandardCampaignResult.transactionHash, getNetwork())}" target="_blank">etherscan</a>
            `;
          }
        });
      } else {
        document.querySelector('#newCampaign_response').innerHTML = `Your WeiFund standard campaign is being created with transaction hash: ${newStandardCampaignResult.transactionHash}`;
      }
    });
  }
};

// draw details
const drawDetails = function(campaignRegistryInstance, campaignDataRegistryInstance) {
  document.querySelector('#details_campaignRegistryAddr').innerHTML = campaignRegistryInstance.address;
  document.querySelector('#details_campaignDataRegistryAddr').innerHTML = campaignDataRegistryInstance.address;
}

// draw selected account
const drawSelectedAccount = function() {
  // draw selected account
  document.querySelector('#details_selectedAccount').innerHTML = getDefaultAccount();
};

// draw current locale
const drawLocale = function() {
  document.querySelector('#details_locale').innerHTML = getLocale();
};

// draw staff picks address
const drawStaffPicksAddress = function(address) {
  document.querySelector('#details_staffPicksAddr').innerHTML = `${address || '0x'}`;
};

// register campaign data
const handleRegisterCampaignData = function(){
  const campaignAddress = document.querySelector('#registerCampaignData_campaign').value;
  const ipfsHash = document.querySelector('#registerCampaignData_ipfsHash').value;
  const ipfsHashHex = ipfs.utils.base58ToHex(ipfsHash);
  const ipfsHashBytecode = `0x${ipfsHashHex}`;

  // register data with data registry
  campaignDataRegistry.register(campaignAddress, ipfsHashBytecode, function(registerDataError, registerDataResult){
    log('Reg', registerDataError, registerDataResult);
  });
};

// handle payout
const handleCampaignPayout = function(event){
  // payout awaiting approval
  document.querySelector('#payout_response').innerHTML = `Your campaign payout transaction is awaiting approval..`;

  // get campaign for payout
  const selectedCampaignIdInput = parseInt( document.querySelector('#campaign_id').value);
  const selectedCampaign = getCampaign(selectedCampaignIdInput);

  // build contract factory, instance
  const campaignContractFactory = web3.eth.contract(selectedCampaign.abi);
  const campaignContractInstance = campaignContractFactory.at(selectedCampaign.addr);
  const payoutMethodName = selectedCampaign.payoutMethodABIObject.name;
  var payoutParams = [];

  // note:
  // add additional payout params here, if any..

  // add tx object and callback
  payoutParams.push(txObject());
  payoutParams.push(function(payoutError, payoutResultTxHash){
    if (payoutError) {
      document.querySelector('#payout_response').innerHTML = `There was an error while paying out your campaign:  ${String(JSON.stringify(payoutError, null, 2))}`;
    }

    // if tx hash present
    if (payoutResultTxHash) {
      document.querySelector('#payout_response').innerHTML = `Your payout transaction is processing with transaction hash:  ${payoutResultTxHash}`;
    }
  });

  // contribute to campaign instance
  campaignContractInstance[payoutMethodName].apply(campaignContractInstance, payoutParams);
};

// handle a campaign contribution
const handleCampaignContribution = function(event){
  // get contribution value, and convert
  const selectedCampaignIdInput = parseInt( document.querySelector('#campaign_id').value);
  const selectedCampaign = getCampaign(selectedCampaignIdInput);
  const contributeValueInput =  document.querySelector('#campaign_contributeAmount').value;
  const contributeValueWei = web3.toWei(contributeValueInput, 'ether');
  const campaignContractFactory = web3.eth.contract(selectedCampaign.abi);
  const campaignContractInstance = campaignContractFactory.at(selectedCampaign.addr);
  const contributeMethodName = selectedCampaign.contributeMethodABIObject.name;
  const contributeMethodInputParams = selectedCampaign.contributeMethodABIObject.inputs;
  const numContributeMethodInputParams = selectedCampaign.contributeMethodABIObject.inputs.length;
  const contributionIntervalTimeout = 180000; // 15 seconds
  const contributionReceiptIntervalLength = 1000;
  var contributionIntervalTimer = 0;
  var contributionParams = [];

  // contribute to weifund
  const weifundContributionAmount = document.querySelector('#campaign_weifundContributeAmount').value;
  const weifundContributionAmountFloat = parseFloat(weifundContributionAmount);
  const weifundContributionAmountEther = web3.toWei(weifundContributionAmount, 'ether');

  // handle additional contribution inputs
  if (numContributeMethodInputParams > 0) {
    contributeMethodInputParams.forEach(function(inputParam, inputParamIndex) {
        // get input type and value
        const inputType = inputParam.type;
        const inputValue = document.querySelector(`#campaign_contributionInput_${inputParamIndex}`).value;

        // handle contribute input data
        // bool to parseInt, everything else as a string
        if (inputType.indexOf('bool') !== -1) {
          contributionParams.push(parseInt(inputValue));
        } else {
          contributionParams.push(inputValue);
        }
    });
  }

  // confirmation message
  const confirmationMessage = `Contribution Confirmation:

Are you sure you want to contribute ${web3.fromWei(contributeValueWei, 'ether')} ether to the "${selectedCampaign.name}" campaign and make a second donation transaction of ${web3.fromWei(weifundContributionAmountEther, 'ether')} ether to WeiFund?
  `;

  // contribute to campaign instance
  if (confirm(confirmationMessage)) {
    // awaiting tx approval message
    document.querySelector('#contribute_response').innerHTML = `Your contribution transaction is awaiting approval...`;

    // build contribute params
    contributionParams.push(Object.assign({value: contributeValueWei}, txObject()));
    contributionParams.push(function(contributeError, contributeResultTxHash){
      if (contributeError) {
        document.querySelector('#contribute_response').innerHTML = `There was an error while sending your contribution transaction: ${String(JSON.stringify(contributeError, null, 2))}`;
      }

      // if tx hash present
      if (contributeResultTxHash) {
        document.querySelector('#contribute_response').innerHTML = `
        Your contribution transaction is processing with transaction hash:

        ${contributeResultTxHash}

        -- checkout on <a href="${etherScanTxHashUrl(contributeResultTxHash, getNetwork())}">etherscan</a>`;
      }

      // check transaction receipt
      const receiptInterval = setInterval(function(){
        web3.eth.getTransactionReceipt(contributeResultTxHash, function(receiptError, receiptResult){
          if (receiptError) {
            document.querySelector('#contribute_response').innerHTML = `There was an error while getting your transaction receipt: ${String(JSON.stringify(receiptError, null, 2))} with transaction hash: ${contributeResultTxHash}`;

            // clear receipt interval
            clearInterval(receiptInterval);
          }

          // display transaction receipt
          if (receiptResult) {
            getRouter()(`/campaign/${selectedCampaign.id}/contribute/receipt`);
            document.querySelector('#contribute_receiptData').innerHTML = `Your transaction was processed: ${JSON.stringify(receiptResult, null, 2)} with transaction hash: ${contributeResultTxHash}`;

            // clear receipt interval
            clearInterval(receiptInterval);
          }
        });

        // up timer by 1 second
        contributionIntervalTimer += contributionReceiptIntervalLength;

        // if interval checking expires
        if (contributionIntervalTimer >= contributionIntervalTimeout) {
          document.querySelector('#contribute_response').innerHTML = `Contribution transaction checking timed out with transaction hash: ${contributeResultTxHash}. Your contribution either did not process or is taking a very long time to mine.. Receipt interval polling has stopped.`;

          // clear receipt interval
          clearInterval(receiptInterval);
        }
      }, contributionReceiptIntervalLength);
    });

    // send weifund tx
    if (parseFloat(weifundContributionAmount) > 0) {
      web3.eth.sendTransaction(Object.assign({value: weifundContributionAmountEther}, txObject()), function(weifundContributionError, weifundContributionTxHash){
        console.log('WeiFund contribution', weifundContributionError, weifundContributionTxHash);
      });
    }

    // contribute to campaign
    campaignContractInstance[contributeMethodName].apply(campaignContractInstance, contributionParams);
  }
};

// draw campaign
const loadAndDrawCampaign = function(campaignID) {
  // load campaign fresh to draw
  getCampaignData(campaignID, function(campaignLoadError, campaignData){
    if (campaignLoadError) {
      log('Campaign load while drawing...', campaignLoadError);
      return;
    }

    // save in campaigns
    setCampaign(campaignID, campaignData);

    // draw campaign QR contributeInputIndex
    const qr = new QRious({
      element: document.querySelector('#campaign_qrcode'),
      value: campaignData.addr,
    });

    // set selected camapign ID
    document.querySelector('#campaign_id').value = campaignID;

    // draw campaign data
    document.querySelector('#campaign_name').innerHTML = campaignData.name || 'Campaign Name';

    document.querySelector('#campaign_details').innerHTML = `
    Addr. ${campaignData.addr || '0x'} <a href="${etherScanAddressUrl(campaignData.addr, getNetwork())}" target="_blank">etherscan</a> <br />
    Amount Raised: ${web3.fromWei(campaignData.amountRaised, 'ether') || '0'} ether (ETH) <br />
    Beneficiary: ${campaignData.beneficiary || '0x'} <br />
    Expiry: ${`${campaignData.expiry || '0'} (in ${Math.round(Math.abs((campaignData.expiry * 1000 - (new Date()).getTime()) / (oneDay)))} days)`} <br />
    Expired: ${campaignData.hasExpired && 'true' || 'false'}<br />
    Contributors: <span id="campaign_totalContributions">0</span> <br />
    Funding Goal: ${web3.fromWei(campaignData.fundingGoal) || '0'} ether (ETH) <br />
    Version: s.ver${campaignData.version || '0.0.0'} <br />
    Failed: ${campaignData.hasFailed && 'true' || 'false'} <br />
    Succeeded: ${campaignData.hasSucceeded && 'true' || 'false'} <br />
    Load Time: ${campaignData.loadTime || '0'} <br />
    Owner: ${campaignData.owner || '0x'} <br />
    Progress: ${campaignData.progress || '0'}% <br />
    Balance: ${web3.fromWei(campaignData.balance, 'ether') || '0'} ether (ETH) <br />
    Paid Out: ${campaignData.hasPaidOut && 'true' || 'false'} <br />
    Active: ${campaignData.active && 'true' || 'false'} <br />
    Staff Pick: ${campaignData.staffPick && 'true' || 'false'} <br />
    Funding Cap: ${campaignData.hasFundingCap && 'true' || 'false'} <br />

    <h4>Code</h4>
    Campaign Code: ${campaignData.campaignContractCode} <br />
    Beneficiary Code: ${campaignData.beneficiaryContractCode} <br />

    Beneficiary Is MultiSig: ${campaignData.beneficiaryIsMultiSig && 'true' || 'false'} <br />
    Beneficiary Is Contract: ${campaignData.beneficiaryIsContract && 'true' || 'false' } <br />
    Campaign is Contract: ${campaignData.campaignIsContract && 'true' || 'false'} <br />
    Campaign is Standard Campaign: ${campaignData.campaignIsStandard && 'true' || 'false'} <br />

    <h4>Interfaces</h4>
    Interface: ${campaignData.interface || '0x'} <a href="${etherScanAddressUrl(campaignData.interface, getNetwork())}" target="_blank">etherscan</a> <br />
    Contribute ABI: ${campaignData.contributeMethodABI || '--'} <br />
    Payout ABI: ${campaignData.payoutMethodABI || '--'} <br />
    Refund ABI: ${campaignData.refundMethodABI || '--'} <br />

    <h4>Parsed Interfaces</h4>
    Contribute ABI: ${JSON.stringify(campaignData.contributeMethodABIObject)} <br />
    Payout ABI: ${JSON.stringify(campaignData.payoutMethodABIObject)} <br />
    Refund ABI: ${JSON.stringify(campaignData.refundMethodABIObject)}
    <br />
    Contract ABI: ${JSON.stringify(campaignData.abi)} <br />
    `;

    // IPFS Related data
    document.querySelector('#campaign_ipfsHash').innerHTML = campaignData.ipfsHash || '0x';
    document.querySelector('#campaign_ipfsData').innerHTML = JSON.stringify(campaignData.data, null, 2) || '{}';
    document.querySelector('#campaign_hasIPFSData').innerHTML = campaignData.hasIPFSData && 'true' || 'false';
    document.querySelector('#campaign_hasIPFSHash').innerHTML = campaignData.hasIPFSHash && 'true' || 'false';

    // campaign name in multiple pages
    [].slice.call(document.querySelectorAll('.selectedCampaign_name')).forEach(function(campaignNameElement){
      campaignNameElement.innerHTML = `${campaignData.name}`;
    });

    // draw campaign links
    [].slice.call(document.querySelectorAll('.selectedCampaign_link')).forEach(function(campaignLinkElement){
      campaignLinkElement.href = `/campaign/${campaignData.id}`;
    });

    // if no account present
    if (txObject().from === '' || txObject().from === '0x') {
      // awaiting tx approval message
      document.querySelector('#contribute_response').innerHTML = `No account is present, please connect this client to a wallet like Mist/MetaMask or others in order to contribute.`;
    }

    // draw campaign contribute page
    // make contribute button link work
    document.querySelector('#campaign_contributeButton').href = `/campaign/${campaignData.id}/contribute`;
    document.querySelector('#campaign_refundButton').href = `/campaign/${campaignData.id}/refund`;
    document.querySelector('#campaign_payoutButton').href = `/campaign/${campaignData.id}/payout`;

    // display payout
    document.querySelector('#campaign_payout').style.display = (campaignData.hasSucceeded && !campaignData.hasFailed) && 'block' || 'none';

    // display contribute button
    document.querySelector('#campaign_contribute').style.display = (!campaignData.hasSucceeded && !campaignData.hasFailed) && 'block' || 'none';
    document.querySelector('#contribute').style.display = (!campaignData.hasSucceeded && !campaignData.hasFailed && txObject().from !== '') && 'block' || 'none';

    // reset contribute inputs dom draw
    document.querySelector('#campaignContribution_inputs').innerHTML = '';

    // if IPFS data is present
    if (campaignData.hasValidData) {
      try {
        if (campaignData.data.hasOwnProperty('mailChimp')) {
          document.querySelector('#mc-embedded-subscribe-form').style.display = 'block';
          document.querySelector('#mc-embedded-subscribe-form').action = campaignData.data.mailChimp.forms[0].action;
        }
      } catch (mailChimpDrawError) {
        log(`MailChimp draw error: ${mailChimpDrawError}`);
      }
    } else {
      document.querySelector('#mc-embedded-subscribe-form').style.display = 'hide';
    }

    // draw contribution inputs
    campaignData.contributeMethodABIObject.inputs.forEach(function(contributeInput, contributeInputIndex) {

      // set default dom ID and input type
      const contributionInputID = `campaign_contributionInput_${contributeInputIndex}`;
      var contirbutionInputType = 'text';

      // if type is numerical
      if (String(contributeInput.type).indexOf('int') !== -1) {
        contirbutionInputType = 'number';
      }

      document.querySelector('#campaignContribution_inputs').innerHTML += `<label>${parseSolidityMethodName(contributeInput.name)}*</label> <br />`;

      // if type is a bool
      if (contributeInput.type === 'bool') {
        document.querySelector('#campaignContribution_inputs').innerHTML += `<select id="${contributionInputID}" placeholder="${contributeInput.name}">
          <option value="0">False (no)</option>
          <option value="1">True (yes)</option>
         </select> <br /><br />`;
      } else {
        document.querySelector('#campaignContribution_inputs').innerHTML += `<input type="${contirbutionInputType}" id="${contributionInputID}" placeholder="${parseSolidityMethodName(contributeInput.name)}" /> <br /><br />`;
      }
    });
  });
};

// register a campaign with the weifund registry
const handleRegisterCampaign = function(){
  const campaignAddress = document.querySelector('#registerCampaign_campaign').value;
  const campaignInterface =  document.querySelector('#registerCampaign_interface').value;

  // awaiting tx approval
  document.querySelector('#registerCampaign_response').innerHTML = `Awaiting transaction approval for campaign registry...`;

  // send register tx
  campaignRegistry.register(campaignAddress, campaignInterface, txObject(), function(registerError, registerTxHash){
    // handle registry error
    if (registerError) {
      document.querySelector('#registerCampaign_response').innerHTML = `There was an error while registering your campaign: ${registerError}`;
      return;
    }

    // positive message
    document.querySelector('#registerCampaign_response').innerHTML = `Registering your campaign with the WeiFund registry... your TX hash is: ${registerTxHash}`;

    // listen for registry tx
    // campaign focus buttons
    campaignRegistry.CampaignRegistered({_campaign: campaignAddress}, function(registerEventError, registerEventResult) {
      if (registerEventError) { // handle error loudly
        document.querySelector('#registerCampaign_response').innerHTML = `There was an error while registering your campaign: [event] ${registerEventError}`;
        return;
      }

      // positive message
      document.querySelector('#registerCampaign_response').innerHTML = `Your campaign has been registered with the WeiFund registry!   ${registerEventResult.transactionHash}`;
    });
  });
};

// handle a campaign refund
const handleCampaignRefund = function() {
};

// draw campaigns
const drawCampaigns = function(campaignsToDraw) {
  // reset inner html
  document.querySelector('#staffpicks_list').innerHTML = ``;
  document.querySelector('#campaigns_list').innerHTML = ``;

  // draw campaigns in list
  for(var campaignID = 0; campaignID < getCampaigns().length; campaignID++){
    var campaignToDraw = campaignsToDraw[campaignID];
    var campaignDrawTarget = 'campaigns_list';

    // if campaign to draw is no undefined
    if (typeof campaignToDraw !== 'undefined') {

      // campaign is a staff pick, change draw target
      if (campaignToDraw.staffPick === true) {
        campaignDrawTarget = 'staffpicks_list';
      } else {
        campaignDrawTarget = 'campaigns_list';
      }

      // draw in inner html
      document.querySelector(`#${campaignDrawTarget}`).innerHTML += `
      <div style="float: left; width: 200px; height: 150px; padding: 20px; border: 1px dotted #aaa;">
        <h3><a href="/campaign/${campaignID}">${campaignToDraw.name && campaignToDraw.name || 'Unnamed  Campaign'}</a></h3>
        <div>Progress: <span>${campaignToDraw.progress || 0}</span>%</div>
        <div>Amount Raised: <span>${web3.fromWei(campaignToDraw.amountRaised, 'ether')}</span> ETH</div>
        <div>Funding Goal: <span>${web3.fromWei(campaignToDraw.fundingGoal, 'ether')}</span> ETH</div>
        <div>${campaignToDraw.active && 'Active' || 'Inactive'}
      </div>`;
    }
  }

  refreshPageButtons();
};

// load all campaigns
const loadAndDrawCampaignsList = function() {
  // loading message
  document.querySelector('#campaigns_list').innerHTML = `Loading campaigns...`;

  // load campaigns
  getCampaignsData({}, function(loadCampaignsError, loadCampaignsResult){
    // handle errors
    if (loadCampaignsError) {
      document.querySelector('#campaigns_list').innerHTML = `Error while loading campaigns ${JSON.stringify(loadCampaignsError)}`;
      return;
    }

    // if load result is nice
    if (typeof loadCampaignsResult === 'object') {
      Object.keys(loadCampaignsResult).forEach(function(campaignID){
        setCampaign(campaignID, loadCampaignsResult[campaignID]);

        // draw campaigns everytime
        drawCampaigns(getCampaigns());
      });
    }
  });
};

// module exports
module.exports = {
  drawNav: drawNav,
  loadAndDrawCampaign: loadAndDrawCampaign,
  drawCampaigns: drawCampaigns,
  drawDetails: drawDetails,
  drawSelectedAccount: drawSelectedAccount,
  drawLocale: drawLocale,
  drawStaffPicksAddress: drawStaffPicksAddress,
  loadAndDrawCampaignsList: loadAndDrawCampaignsList,
  handleNewCampaign: handleNewCampaign,
  handleRegisterCampaign: handleRegisterCampaign,
  handleCampaignContribution: handleCampaignContribution,
  handleCampaignRefund: handleCampaignRefund,
  handleCampaignPayout: handleCampaignPayout,
  handleRegisterCampaignData: handleRegisterCampaignData,
};
