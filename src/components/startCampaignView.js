const startCampaignView = function(options) {
  const t = options.t;

  return `
  <div style="margin-top: 100px; margin-bottom: 150px;">

    <div class="row center-block container text-center" style="margin-bottom: 60px;">
      <h1 class="text-pretty-huge">Start A Campaign</h1>
      <h4>Launch your project today!</h4>
    </div>

    <div class="row center-block container">
      <div class="col-xs-12 col-sm-8 col-sm-offset-2">
        <h3>Campaign name</h3>
        <p>Select a name for your campaign.</p>
        <input type="text" class="form-control input-lg" id="startCampaign_name" placeholder="Johns Crowdfund" />

        <br /><br />

        <h3>Beneficiary Account</h3>
        <p>The account address where funds will be sent if the campaign is a success.</p>
        <input type="text" class="form-control input-lg" id="startCampaign_beneficiary" placeholder="0x32100217d32474d1637b4ddd04eb67b6adecf01v" />

        <br />

        <button id="startCampaign_useMyAccount" class="btn btn-default btn-info">Use My Account</button>

        <br /><br /><br />

        <h3>Funding Goal</h3>
        <p>The total amount of fund you would like to raise.</p>

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-8">
            <div class="input-slider input-slider-lg" data-input-id="startCampaign_fundingGoal">
              <div class="input-slider-rail">
                <div class="input-slider-rail-highlight"></div>
                <div class="input-slider-bar"></div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="input-group">
              <input type="text" id="startCampaign_fundingGoal" value="25" class="form-control input-lg"  placeholder="50" aria-describedby="basic-addon2" />
              <span class="input-group-addon" id="basic-addon2">ether</span>
            </div>
          </div>
        </div>

        <br />

        <small>Note, if the funding goal is not met by the time of expiry, all funds will be returned to the campaign contributors.</small>

        <br /><br />

        <h3>End Date (Expiry)</h3>
        <p>The date at which the campaign will end.</p>

        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-8">
            <div class="input-slider input-slider-lg" data-input-id="startCampaign_expiry">
              <div class="input-slider-rail">
                <div class="input-slider-rail-highlight"></div>
                <div class="input-slider-bar"></div>
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-4">
            <div class="input-group">
              <input type="text" id="startCampaign_expiry" value="30" class="form-control input-lg" placeholder="30" aria-describedby="basic-addon2" />
              <span class="input-group-addon" id="basic-addon2">days</span>
            </div>
          </div>
        </div>

        <br /><br />

        <h3>Register</h3>
        <p>This will register this campaign with the WeiFund campaign registry.</p>

        <br />

        <div class="row" style="padding-left: 20px;">
          <div class="col-xs-2 col-sm-2 col-md-1">
            <input type="checkbox" id="startCampaign_register" class="form-control input-sm" checked="checked" />
          </div>
          <div class="col-xs-10 col-sm-10 col-md-11">
            <h4>Register This Campaign</h4>
          </div>
        </div>

        <br />

        <small>Note, this will create a small second transaction.</small>

        <br /><br /><br />

        <h3>Disclaimer</h3>

        <p>You must read and agree to this disclaimer before starting this campaign.</p>

        <textarea class="form-control input-lg text-uppercase">Disclaimer

  The data displayed in the Public Data tool is provided by the third party indicated as the data source. WeiFund does not create this data, vouch for its accuracy, or guarantee that it is the most recent data available from the data provider. For many or all of the data, the data is by its nature approximate and will contain some inaccuracies. The data may contain errors introduced by the data provider(s) and/or by WeiFund. The names of countries and other territories shown in the tool may differ from those in the original data.

  WeiFund (A) expressly disclaims the accuracy, adequacy, or completeness of any data and (B) shall not be liable for any errors, omissions or other defects in, delays or interruptions in such data, or for any actions taken in reliance thereon. Neither WeiFund nor any of its data providers will be liable for any damages relating to your use of the data provided herein.
        </textarea>

        <br /><br />

        <div class="row" style="padding-left: 20px;">
          <div class="col-xs-2 col-sm-2 col-md-1">
            <input type="checkbox" id="startCampaign_disclaimer" class="form-control input-sm" />
          </div>
          <div class="col-xs-10 col-sm-10 col-md-11">
            <h5>By checking this box, you agree to the WeiFund disclaimer.</h5>
          </div>
        </div>

        <br />
        <br />

        <hr />

        <br />

        <button id="startCampaign_button" class="btn btn-primary btn-lg">Start Campaign</button>

        <br />
        <br />

        <div id="startCampaign_info_response" class="alert alert-info" style="display: none;">
          <h4>Campaign Creation In Progess</h4>
          <p id="startCampaign_info_response_body"></p>
        </div>

        <div id="startCampaign_warning_response" class="alert alert-warning" style="display: none;">
          <h4>Warning!</h4>
          <p id="startCampaign_warning_response_body"></p>
        </div>

      </div>
    </div>

  </div>
  `;
};

module.exports = startCampaignView;
