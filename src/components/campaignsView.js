const campaignsView = function(options) {
  return `
    <br />

    <h1 class="text-huge text-center">Explore a universe of next-gen technology</h1>
    <h3 class="text-center">Tons of amazing projects.</h3>

    <br /><br /><br /><br /><br /><br /><br />

    <div class="row">
      <div id="staffpicks_list"><h3>Loading campaigns...</h3></div>
    </div>

    <br /><br /><br /><br /><br /><br />

    <div class="row">
      <h3>Campaigns</h3>

      <br /><br />

      <div id="campaigns_list"><h3>Loading campaigns...</h3></div>
    </div>
  </div>
  `;
};

module.exports = campaignsView;
