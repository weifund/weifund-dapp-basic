const navBar = function(options) {
  return `
  <nav class="navbar nav navbar-fixed-top row">
    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4 nav-left hidden-xs hidden-sm">
      <a href="/">Discover</a>
      <a href="/start" style="padding-left: 40px;">Start a campaign</a>
    </div>
    <div class="col-xs-6 col-sm-12 col-md-4 col-lg-4 text-center">
      <a href="/"><img id="nav-logo" src="/styles/weifund-logo-small.png"></a>
    </div>
    <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 nav-right text-left-xs text-left-sm hidden-xs hidden-sm">
      <select class="footer-locale-select">
        <option>Locale</option>
        <option>en</option>
        <option>cmn</option>
      </select>
      <a href="/account">My account</a>
    </div>

    <div class="col-xs-6 visible-xs text-right hidden-lg">
      <button type="button" class="navbar-toggle visible-sm visible-xs" style="padding: 0px;" data-target-id="nav-mobile-toggle">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
    </div>

    <div class="col-sm-12 hidden-xs hidden-md hidden-lg">
      <hr />
      <div class="row">
        <div class="col-xs-6 col-sm-6">
          <a href="/">Discover</a>
          <a href="/start" style="padding-left: 40px;">Start a campaign</a>
        </div>
        <div class="col-xs-6 col-sm-6 text-right">
          <select class="footer-locale-select">
            <option>Locale</option>
            <option>en</option>
            <option>cmn</option>
          </select>
          <a href="/account">My account</a>
        </div>
      </div>
    </div>

    <div id="nav-mobile-toggle" class="hidden-md hidden-lg">
      <div class="row">
        <div class="col-xs-12 col-sm-12">
          <br />
          <br />
          <h3>
            <ul class="list-group">
              <li class="list-group-item">
                <a href="/">Discover</a>
                <a href="/start" style="padding-left: 40px;">Start a campaign</a>
              </li>
              <li class="list-group-item">
                <select class="footer-locale-select">
                  <option>Locale</option>
                  <option>en</option>
                  <option>cmn</option>
                </select>
              </li>
              <li class="list-group-item">
                <a href="/account">My account</a>
              </li>
            </ul>
          </h3>
        </div>
      </div>
    </div>

  </nav>`;
};

module.exports = navBar;
