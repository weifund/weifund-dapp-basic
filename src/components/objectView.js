const isBigNumber = require('weifund-util').isBigNumber;

const capitalize = function(word) {
    return word.charAt(0).toUpperCase() + word.substring(1);
}

const toCapitalizedWords = function(name) {
  var words = name.match(/[A-Za-z][a-z]*/g);

  return words.map(capitalize).join(" ");
}

// intake object, return html
const objectView = function(options) {
  var returnedHTML = ``;
  const object = options.object;
  const layout = options.layout;
  const web3 = options.web3;

  // move through layout, display what is set in options.layout
  Object.keys(layout).forEach(function(objectKey, keyIndex){
    // if property exists
    if (!object.hasOwnProperty(objectKey)) {
      return;
    }

    // setup value input, output and layout object
    const valueInput = object[objectKey];
    var valueOutput = `none`;
    var layoutObject = {};

    // build layout object, if any
    if (typeof layout[objectKey] === 'object') {
      layoutObject = layout[objectKey];
    }

    // handle input of undefined
    if (typeof valueInput === 'undefined') {
      valueOutput = 'undefined';
    }

    // handle boolean input
    if (typeof valueInput === 'boolean') {
      valueOutput = `${valueInput && `true` || `false`}`;
    }

    // handle number
    if (typeof valueInput === 'number') {
      valueOutput = `${String(valueInput)}`;
    }

    // handle string
    if (typeof valueInput === 'string') {
      valueOutput = valueInput;
    }

    // handle object
    if (typeof valueInput === 'object') {
      // handle bignumber
      if (isBigNumber(valueInput)) {
        valueOutput = valueInput.toString(10);
      }

      // handle just standard type
      valueOutput = `<pre style="overflow: scroll;">${JSON.stringify(valueInput, null, 2)}</pre>`
    }

    // handle special type ether
    if (layoutObject.type === 'ether') {
      valueOutput = `${web3.fromWei(valueInput, 'ether').toString(10)} ether (ETH)`;
    }

    // add to html return
    returnedHTML += `
      <br />
      <h4>${layoutObject.name && layoutObject.name || toCapitalizedWords(objectKey)}</h4>
      <small>${layoutObject.description}</small>
      <h5>${valueOutput}</h5>
    `;
  });

  // return html
  return returnedHTML;
};

module.exports = objectView;
