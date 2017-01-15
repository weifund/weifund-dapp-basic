export default function handleConfirmOnPageExit(e) {
  // If we haven't been passed the event get the window.event
  e = e || window.event;

  console.log(window.location);

  const message = `
    WARNING:


    Leaving this page while a transaction is in progress may result in a loss of funds or data.

    Please ensure your transactions have completed or are not in progress before exiting or reloading this page.
  `;

  // For Chrome, Safari, IE8+ and Opera 12+
  if (window.location.href.indexOf('/contribute') !== -1
    || window.location.href.indexOf('/account') !== -1
    || window.location.href.indexOf('/payout') !== -1
    || window.location.href.indexOf('/refund') !== -1) {
    // For IE6-8 and Firefox prior to version 4
    if (e) {
      e.returnValue = message;
    }

    return message;
  }
}
