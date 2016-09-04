const footer = function(options) {
  const t = options.t;

  return `<footer class="row text-light-gray no-padding-xs no-padding-sm">
  <div class="container row center-block" style="padding: 40px;">
    <div class="col-xs-12">
      <div class="row">
        <div class="col-xs-12 col-sm-3">
          <h4 class="text-light-gray">${t("footer.headers.discover")}</h4>
          <a href="/" class="text-light-gray">${t("footer.active")}</a> <br/>
          <a href="/" class="text-light-gray">${t("footer.inactive")}</a>
        </div>
        <div class="col-xs-12 col-sm-3">
          <h4 class="text-light-gray">${t("footer.headers.community")}</h4>
          <a href="https://www.reddit.com/r/ethereum/" class="text-light-gray">${t("footer.redditEthereum")}</a> <br/>
        </div>
        <div class="col-xs-12 col-sm-3">
          <h4 class="text-light-gray">${t("footer.headers.powered")}</h4>
          <a href="http://infura.io" class="text-light-gray">${t("footer.infura")}</a> <br/>
          <a href="https://ipfs.io/" class="text-light-gray">${t("footer.ipfs")}</a> <br/>
          <a href="https://ethereum.org" class="text-light-gray">${t("footer.ethereum")}</a> <br/>
          <a href="http://consensys.net" class="text-light-gray">${t("footer.consensys")}</a> <br/>
        </div>
        <div class="col-xs-12 col-sm-3">
          <h4 class="text-light-gray">${t("footer.headers.connect")}</h4>
          <a href="http://weifund.io" class="text-light-gray">${t("footer.weifundWebsite")}</a> <br/>
          <a href="http://reddit.com/r/weifund" class="text-light-gray">${t("footer.weifundReddit")}</a> <br/>
        </div>
      </div>
      <br />

      <hr />

      <br />
      <div class="row">
        <div class="col-xs-6 col-md-9">
          <a href="/"><img src="/styles/weifund-logo-small-white.png" style="height: 35px; max-width: auto;" /></a>
          <br />
          <small>${t("footer.copyright")}</small>
        </div>
        <div class="col-xs-6 col-md-3 text-right">
          <select class="input-locale-toggle nav-locale-select">
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
