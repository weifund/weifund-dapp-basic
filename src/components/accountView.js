import yo from 'yo-yo';

// export method
module.exports = accountView;

// main export
function accountView(options) {
  return yo`
    <div class="container" style="height: 600px;">
      <div class="row">
        <div class="col-xs-12">
          <br />
          <h2>My Account</h2>
          <h3>This feature is not yet supported.</h3>
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  `;
}
