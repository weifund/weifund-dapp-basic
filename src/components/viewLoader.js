const viewLoader = function(options) {
  if (typeof options === 'undefined') {
    options = {};
  }

  return `<div style="height: 500px;">
    <span class="cssload-loader" style="margin-top: 17%;"><span class="cssload-loader-inner"></span></span>
    <br />
    <br />
    <br />
    <h3 style="text-align: center;">
      ${options.message && options.message || 'Loading campaigns from the blockchain... this may take a minute'}
    </h3>
  </div>`;
};

module.exports = viewLoader;
