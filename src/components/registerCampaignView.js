module.exports = registerCampaignView;

// main export
function registerCampaignView(options) {
  const t = options.t;

  return `
    <h2>CampaignRegistry | Register Your Campaign</h2>

    <p>Note, you must be the 'owner()' of the campaign =D</p>

    <input type="text" id="registerCampaign_campaign" placeholder="campaign address*" />
    <input type="text" id="registerCampaign_interface" placeholder="campaign interface" />

    <br /><br />

    <button id="registerCampaign">Register Campaign!</button>

    <div id="registerCampaign_response"></div>

    <hr />

    <h2>CampaignDataRegistry | Register IPFS Data</h2>

    <p>Note, you must be the 'owner()' of the campaign =D</p>

    <input type="text" id="registerCampaignData_campaign" placeholder="campaign address*" />
    <input type="text" id="registerCampaignData_ipfsHash" placeholder="IPFS hash" />

    <br /><br />

    <button id="registerCampaignData">Register Campaign Data!</button>

    <div id="registerCampaignData_response"></div>`;
}
