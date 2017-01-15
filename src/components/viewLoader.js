import yo from 'yo-yo';

// main component
export default function viewLoader(options) {
  // handle no options
  if (typeof options === 'undefined') {
    options = {};
  }

  const t = options.t;

  // scroll window view to top
  window.scrollTo(0, 0);

  // return tempalte
  return yo`<div style="height: 500px;">
    <span class="cssload-loader" style="margin-top: 17%;"><span class="cssload-loader-inner"></span></span>
    <br />
    <br />
    <br />
    <h3 style="text-align: center;">
      ${options.message && options.message || t('viewLoader.defaultLoadingMessage')}
    </h3>
  </div>`;
}
