// export method
module.exports = campaignContributeNav;

// main export
function campaignContributeNav(options) {
  const t = options.t;

  return `
  <div class="row">
    <div class="col-xs-12">
      <hr />
    </div>
  </div>
  <div class="row">
    <div class="col-xs-6 text-left">
      ${options.showBackButton === false && `` || `<a href="${options.backURL}" class="btn btn-primary">Back</a>`}
    </div>
    <div class="col-xs-6 text-right">
    </div>
  </div>
  `;
}
