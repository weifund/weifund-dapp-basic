const footer = function() {
  return `<footer class="row text-light-gray no-padding-xs no-padding-sm">
  <div class="container row center-block" style="padding: 40px;">
    <div class="col-xs-12">
      <div class="row">
        <div class="col-xs-12 col-sm-6 col-md-6">
          <h4 class="text-light-gray">Discover</h4>
          <a href="/" class="text-light-gray">Active</a> <br/>
          <a href="/" class="text-light-gray">Inactive</a>
        </div>
        <div class="col-xs-12 col-md-6">
          <h4 class="text-light-gray">Connect With Us</h4>
          <a href="http://weifund.io" class="text-light-gray">weifund.io</a> <br/>
          <a href="http://reddit.com/r/weifund" class="text-light-gray">Reddit</a> <br/>
        </div>
      </div>
      <br />

      <hr />

      <br />
      <div class="row">
        <div class="col-xs-6 col-md-9">
          <a href="/"><img src="/weifund-logo-small-white.png" style="height: 35px; max-width: auto;" /></a>
          <br />
          <small>&copy; 2016</small>
        </div>
        <div class="col-xs-6 col-md-3 text-right">
          <select class="nav-locale-select">
            <option>Language</option>
            <option>en</option>
            <option>cmn</option>
          </select>
        </div>
    </div>
  </div>
</footer>`;
};

module.exports = footer;
