// requires
const xss = require('xss');
const BigNumber = require('bignumber.js');

// log abstraction
const log = function() {
  console.log.apply(console, arguments);
};

// one day in unix seconds
const oneDay = 24*60*60*1000;

// just an empty addr
const emptyWeb3Address = '0x0000000000000000000000000000000000000000';

// provide etherscan link
const etherScanAddressUrl = function(address, selectedNetwork) {
  return `http://${`${selectedNetwork}.` || ''}etherscan.io/address/${address}`
};

// provide etherscan link
const etherScanTxHashUrl = function(txHash, selectedNetwork) {
  return `http://${`${selectedNetwork}.` || ''}etherscan.io/tx/${txHash}`
};

// parse raw campaign data into an object
const parseCampaignRegistryData = function(campaignID, rawCampaignData) {
  const dataObject = {
    id: parseInt(campaignID),
    addr: rawCampaignData[0],
    interface: rawCampaignData[1],
    registered: rawCampaignData[2].toNumber(10),
  };

  // make interface address if non provided
  if (dataObject.interface == emptyWeb3Address) {
    dataObject.interface = dataObject.addr;
  }

  // return new data object
  return dataObject;
};

// build inputs or outputs array from raw inputs string
const buildInputsArray = function(rawInputsString) {
  var returnArray = [];
  const rawMethodInputs = rawInputsString.split(',');

  // no inputs
  if (typeof rawMethodInputs === 'undefined' || rawMethodInputs.length === 0) {
    return [];
  }

  rawMethodInputs.forEach(function(rawMethodInput) {
    const inputData = rawMethodInput.split(' ');
    const type = inputData[0];
    const name = inputData[1] || '';

    // if type exists
    if (type !== '' && typeof type !== 'undefined') {
      returnArray.push({'type': type, 'name': name});
    }
  });

  return returnArray;
};

// cap first letter of words of words in string
const capitalizeFirstLetter = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// convert programatical name to pretty name
const parseSolidityMethodName = function(rawName) {
  // break into parts
  var parseNamePieces = rawName.split(/(?=[A-Z])/);

  // cap first letter
  parseNamePieces = parseNamePieces.map(function(namePieceItem){
    return capitalizeFirstLetter(namePieceItem);
  });

  // rejoin name with space
  return parseNamePieces.join(' ');
};

// is bignumber
const isBigNumber = function(obj) {
  if (typeof obj === 'object' && obj !== null) {
    if (typeof obj.__proto__.dividedToIntegerBy !== 'undefined') {
      return true;
    }
  }

  return false;
};

// parse a solidity method interface
const parseSolidityMethodInterface = function(methodInterface) {
  if (methodInterface === '' || typeof methodInterface === 'undefined') {
    return {};
  }

  // count open and clsoed
  var methodABIObject = {};
  const openBrackets = (methodInterface.match(/\(/g) || []).length;
  const closedBrackets = (methodInterface.match(/\)/g) || []).length;
  const colonCount = (methodInterface.match(/\:/g) || []).length;
  const hasOutputs = openBrackets === 2 && closedBrackets == 2 && colonCount == 1;
  const hasInvalidCharacters = methodInterface.replace(/([A-Za-z0-9\_\s\,\:(\)]+)/g, '').trim().length > 0;

  // invalid characters
  if (hasInvalidCharacters) {
    throw 'Invalid interface, your method interface contains invalid chars. Only letters, numbers, spaces, commas, underscores, brackets and colons.';
  }

  // method ABI object assembly
  methodABIObject.name = methodInterface.slice(0, methodInterface.indexOf('('));
  methodABIObject.type = 'function';
  methodABIObject.constant = false;
  const methodInputsString = methodInterface.slice(methodInterface.indexOf('(') + 1, methodInterface.indexOf(')')).trim();
  const methodOutputString = (hasOutputs &&  methodInterface.slice(methodInterface.lastIndexOf('(') + 1, methodInterface.lastIndexOf(')')) || '').trim();
  methodABIObject.inputs = buildInputsArray(methodInputsString);
  methodABIObject.outputs = buildInputsArray(methodOutputString);

  // check open brackets
  if (methodABIObject.name === '' || typeof methodABIObject.name === 'undefined') {
    throw 'Invalid interface, no method name';
  }

  // check open brackets
  if (openBrackets != 1 && openBrackets != 2) {
    throw 'Invalid, too many or too little open brackets in solidity interface!';
  }

  // check open brackets
  if (openBrackets != 1 && openBrackets != 2) {
    throw 'Invalid, too many or too little open brackets in solidity interface!';
  }

  // check closed brackets
  if (closedBrackets != 1 && closedBrackets != 2) {
    throw 'Invalid, too many or too little closed brackets in solidity interface!';
  }

  // check colon count
  if (colonCount != 0 && colonCount != 1) {
    throw 'Invalid interface, to many or too little colons.';
  }

  // return method abi object
  return methodABIObject;
};

// This function handles arrays and objects
const filterXSSObject = function(obj){
  // if object is a string, handle it
  if (typeof obj === 'string') {
    return xss(obj);
  }

  // if object is an array
  if (Array.isArray(obj)) {
    return obj.map(function(item){
      return filterXSSObject(item);
    });
  }

  // if is big number, parse string, then re-create bignumber
  if (typeof obj === 'object' && obj !== null) {
    const objProto = Object.getPrototypeOf(obj);

    // if obj has bignumber properties
    if (objProto.hasOwnProperty('toString')
      && objProto.hasOwnProperty('dividedBy')
      && objProto.hasOwnProperty('toNumber')) {
      return new BigNumber(xss(obj.toString(10)));
    }
  }

  // for loop through object
  if (typeof obj === 'object' && obj !== null) {
    var newObject = {};

    for (var k in obj) {
      newObject[xss(k)] = filterXSSObject(obj[k]);
    }

    return newObject;
  }

  // return object
  return obj;
};


// calculate outer height off an element
const outerElHeight = function(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
};

const outerElWidth = function(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
};

// buidl all nav togglesbuildAllNavToggles
const buildAllNavToggles = function() {
  [].slice.call(document.querySelectorAll('.navbar-toggle')).forEach(function(navBarToggle){
    navBarToggle.addEventListener('click', function(event){

      var toggleState = false;
      const toggleTarget = document.querySelector(`#${navBarToggle.dataset.targetId}`);

      const getToggleState = function() {
        return toggleState();
      };

      if (toggleTarget !== null && toggleTarget.length !== 0) {
        const toggleTargetOuterHeight = outerElHeight(toggleTarget);
        const toggleTargetFirsChildOuterHeight = outerElHeight(toggleTarget.children[0]);

        if (toggleTargetOuterHeight === 0) {
          toggleTarget.style.height = `${toggleTargetFirsChildOuterHeight}px`;
        } else {
          toggleTarget.style.height = `0px`;
        }
      }
    });
  });
};

// build all input sliders
const buildAllInputSliders = function() {
  [].slice.call(document.querySelectorAll('.input-slider')).forEach(function(inputSliderElement){
    // setup rail and bar
    const inputSliderRailHighlight = inputSliderElement.querySelector('.input-slider-rail-highlight');
    const inputSliderRail = inputSliderElement.querySelector('.input-slider-rail');
    const inputSliderBar = inputSliderElement.querySelector('.input-slider-bar');
    var inputSliderDraggable = false;

    // setup slider state getter
    const getSliderState = function() {
      return inputSliderDraggable;
    };

    // setup slider mouseup handler
    const handleInputSliderMouseUp = function(event) {
      inputSliderDraggable = false;
    };

    // setup slider mouse down handler
    const handleInputSliderMouseDown = function(event) {
      inputSliderDraggable = true;
      handleInputSliderMouseMove(event);
      event.preventDefault();
    };

    // setup slider mouse move handler
    const handleInputSliderMouseMove = function(event){
      if (!getSliderState()) {
        return;
      }

      // slider width, offset position, baroffsetleft, mouse position
      // calculare shim, mouse fix and bar position
      const sliderWidth = outerElWidth(inputSliderElement);
      const sliderOffsetLeft = inputSliderElement.getBoundingClientRect().left;
      const sliderBarOffsetLeft = inputSliderBar.getBoundingClientRect().left;
      const clientX = event.clientX;
      var barLeftPositionShim = (parseFloat(((clientX - sliderOffsetLeft) / sliderWidth) - 1).toFixed(2) * 17) * -1;
      var barLeftPositionPercentage = ((clientX - barLeftPositionShim - sliderOffsetLeft) / sliderWidth) * 100;

      // fix invarience
      if (barLeftPositionPercentage > 100 || clientX > sliderOffsetLeft + sliderWidth) {
        barLeftPositionPercentage = 100;
      }

      // fix invarience
      if (barLeftPositionPercentage < 0 || clientX < sliderOffsetLeft) {
        barLeftPositionPercentage = 0;
      }

      // handle input id
      if (typeof inputSliderElement.dataset.inputId === 'string') {
        const dataInputElement = document.querySelector(`#${inputSliderElement.dataset.inputId}`);

        // if element exists
        if (dataInputElement !== null && dataInputElement.length !== 0) {
          dataInputElement.value = parseFloat(barLeftPositionPercentage).toFixed(2);
        }

        // dispatch change event
        var e = document.createEvent('HTMLEvents');
        e.initEvent('change', false, false);
        dataInputElement.dispatchEvent(e);
      }

      // set input slider bar left position
      inputSliderBar.style.left = `${barLeftPositionPercentage}%`;
      inputSliderRailHighlight.style.width = `${barLeftPositionPercentage}%`;
    };

    // handle input change
    if (typeof inputSliderElement.dataset.inputId === 'string') {
      const dataInputElement = document.querySelector(`#${inputSliderElement.dataset.inputId}`);

      // handle input element change
      const handleInputElementChange = function(event) {
        var inputElementValue = parseInt(dataInputElement.value, 10);

        if (inputElementValue > 100) {
          inputElementValue = 100;
        }

        if (inputElementValue < 0) {
          inputElementValue = 0;
        }

        if (!isNaN(inputElementValue)) {
          // set input slider bar left position
          inputSliderBar.style.left = `${inputElementValue}%`;
          inputSliderRailHighlight.style.width = `${inputElementValue}%`;
        }
      };

      // instantiate initial handler default input
      handleInputElementChange({});

      // mouse move listener
      document.body.addEventListener('change', handleInputElementChange, false);
    }

    // mouse move listener
    document.body.addEventListener('mousemove', handleInputSliderMouseMove, false);

    // mouse down lisener
    inputSliderElement.addEventListener('mousedown', handleInputSliderMouseDown, false);

    // mouse up listeners
    inputSliderRail.addEventListener('mouseup', handleInputSliderMouseUp, false);
    inputSliderBar.addEventListener('mouseup', handleInputSliderMouseUp, false);
    document.body.addEventListener('mouseup', handleInputSliderMouseUp, false);

  });
};

module.exports = {
  log: log,
  isBigNumber: isBigNumber,
  etherScanAddressUrl: etherScanAddressUrl,
  etherScanTxHashUrl: etherScanTxHashUrl,
  parseCampaignRegistryData: parseCampaignRegistryData,
  buildInputsArray: buildInputsArray,
  oneDay: oneDay,
  parseSolidityMethodInterface: parseSolidityMethodInterface,
  emptyWeb3Address: emptyWeb3Address,
  capitalizeFirstLetter: capitalizeFirstLetter,
  filterXSSObject: filterXSSObject,
  parseSolidityMethodName: parseSolidityMethodName,
  outerElHeight: outerElHeight,
  outerElWidth: outerElWidth,
  buildAllNavToggles: buildAllNavToggles,
  buildAllInputSliders: buildAllInputSliders,
};
