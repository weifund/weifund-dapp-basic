// confirm on page exit
const handleConfirmOnPageExit = function (e) {
  // If we haven't been passed the event get the window.event
  e = e || window.event;

  const message = `
    WARNING:


    Leaving this page while a transaction is in progress may result in a loss of funds or data.

    Please ensure your transactions have completed or are not in progress before exiting or reloading this page.
  `;

  // For IE6-8 and Firefox prior to version 4
  if (e) {
    e.returnValue = message;
  }

  // For Chrome, Safari, IE8+ and Opera 12+
  return message;
};

module.exports = handleConfirmOnPageExit;
