// document helper
import { el } from '../document';

// get outeriwdth of element
function outerElWidth(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}

// export method
module.exports = drawAllInputSliders;

// build all input sliders
function drawAllInputSliders() {
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
      var fixedDecimalAmount = 2;

      // fix invarience
      if (barLeftPositionPercentage > 100 || clientX > sliderOffsetLeft + sliderWidth) {
        barLeftPositionPercentage = 100;
      }

      // fix invarience
      if (barLeftPositionPercentage < 0 || clientX < sliderOffsetLeft) {
        barLeftPositionPercentage = 0;
      }

      if (inputSliderElement.dataset.fixedDecimalAmount) {
        fixedDecimalAmount = parseInt(inputSliderElement.dataset.fixedDecimalAmount, 10);
      }

      // handle input id
      if (typeof inputSliderElement.dataset.inputId === 'string') {
        const dataInputElement = el(`#${inputSliderElement.dataset.inputId}`);

        // if element exists
        if (dataInputElement !== null && dataInputElement.length !== 0) {
          dataInputElement.value = parseFloat(barLeftPositionPercentage).toFixed(fixedDecimalAmount);
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
      const dataInputElement = el(`#${inputSliderElement.dataset.inputId}`);

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
}
