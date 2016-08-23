// app views
const views = [
  'view-campaign-contribute',
  'view-campaign-contribute-receipt',
  'view-campaign-payout',
  'view-campaign-payout-receipt',
  'view-campaign-refund',
  'view-campaign-refund-receipt',
  'view-landing',
  'view-start',
  'view-register',
  'view-list',
  'view-focus',
  'view-receipt',
  'view-account',
  'view-404',
];

// close all views
const closeAllViews = function() {
  // set all views to hidden
  views.forEach(function(viewId) {
    document.querySelector(`#${viewId}`).style.display = 'none';
  });
};

// open view
const openView = function(openViewId) {
  // clsoe all views
  closeAllViews();

  // open selected view
  document.querySelector(`#${openViewId}`).style.display = '';
};

// export
module.exports = {
  views: views,
  openView: openView,
  closeAllViews: closeAllViews,
};
