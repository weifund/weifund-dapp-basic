import yo from 'yo-yo';

// export method
module.exports = footer;

// main export
function footer(options) {
  const t = options.t;

  return yo`<footer class="row text-light-gray no-padding-xs no-padding-sm">
  <div class="container row center-block" style="padding: 40px;">
    <div class="col-xs-12">
      <div class="row">
        <div class="col-xs-12 col-sm-3">
          <h4 class="text-light-gray">Documentation</h4>
          <a href="https://weifund.readthedocs.io/en/latest/#welcome-to-weifund" target="_blank" class="text-light-gray">Welcome</a> <br />
          <a href="https://weifund.readthedocs.io/en/latest/getting_started/campaigns/" target="_blank" class="text-light-gray">Getting Started</a>  <br />
          <a href="https://weifund.readthedocs.io/en/latest/security/overview/" target="_blank" class="text-light-gray">Security</a> <br />
          <a href="https://weifund.readthedocs.io/en/latest/specifications/overview/" target="_blank" class="text-light-gray">Specifications</a> <br />
        </div>
        <div class="col-xs-12 col-sm-3">
          <h4 target="_blank" class="text-light-gray">${t("footer.headers.community")}</h4>
          <a target="_blank" href="https://www.reddit.com/r/ethereum/" class="text-light-gray">${t("footer.redditEthereum")}</a> <br />
          <a target="_blank" href="https://www.reddit.com/r/ipfs/" class="text-light-gray">IPFS</a> <br />
          <a target="_blank" href="https://forum.ethereum.org" class="text-light-gray">Ethereum Forum</a> <br />
        </div>
        <div class="col-xs-12 col-sm-3">
          <h4 class="text-light-gray">${t("footer.headers.powered")}</h4>
          <a target="_blank" href="http://infura.io" class="text-light-gray">${t("footer.infura")}</a> <br />
          <a target="_blank" href="https://ipfs.io/" class="text-light-gray">${t("footer.ipfs")}</a> <br />
          <a target="_blank" href="https://ethereum.org" class="text-light-gray">${t("footer.ethereum")}</a> <br />
          <a target="_blank" href="http://consensys.net" class="text-light-gray">${t("footer.consensys")}</a> <br />
        </div>
        <div class="col-xs-12 col-sm-3">
          <h4 class="text-light-gray">${t("footer.headers.connect")}</h4>
          <a target="_blank" href="http://weifund.io" class="text-light-gray">${t("footer.weifundWebsite")}</a> <br />
          <a target="_blank" href="http://twitter.com/weifund" class="text-light-gray">twitter</a> <br />
          <a target="_blank" href="mailto:mail@weifund.io" class="text-light-gray">email</a> <br />
        </div>
      </div>
      <br />

      <hr />

      <br />
      <div class="row">
        <div class="col-xs-6 col-md-9">
          <a href="/"><img src="/styles/weifund-logo-small-white.png" style="height: 35px; max-width: auto;" /></a>
          <br />
          <small>© ${t("footer.copyright")}</small>
        </div>
        <div class="col-xs-6 col-md-3 text-right">
          <a href="http://weifund.readthedocs.org" target="_blank">Read The Docs</a>
        </div>
    </div>
  </div>
</footer>`;
}
