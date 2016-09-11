const parseMethodABIObject = require('weifund-util').parseMethodABIObject;

// review function
const methodABIInputsReview = function(options) {
  // the output html
  var outputHTML = ``;

  // campagin object, method type, method abi object
  const campaignObject = options.campaignObject;
  const methodType = options.methodType;
  const t = options.t;
  const methodABIObject = parseMethodABIObject(methodType, campaignObject[`${methodType}MethodABIObject`]);

  // draw contribution inputs
  methodABIObject.inputs.forEach(function(methodInput, methodInputIndex) {
    outputHTML += `

    <h4>${methodInput.nameParsed}</h4>

    <h4><b><span id="${methodInput.id}_review">${methodInput.defaultValue}<span></b> <small>${methodInput.units}</small></h4>

    <br />

    `;
  });

  // output html
  return outputHTML;
};

// export module
module.exports = methodABIInputsReview;
