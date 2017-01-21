import BigNumber from 'bignumber.js';

// document helper
import { el } from '../document';

// get outeriwdth of element
function outerElWidth(el) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}


export default function drawAllInputSliders() {
  [].slice.call(document.querySelectorAll('.input-slider')).forEach((inputSliderElement) => {
    // setup rail and bar
    const inputSliderRailHighlight = inputSliderElement.querySelector('.input-slider-rail-highlight');
    const inputSliderRail = inputSliderElement.querySelector('.input-slider-rail');
    const inputSliderBar = inputSliderElement.querySelector('.input-slider-bar');
    const inputSliderMax = 100;
    var e = null;
    var inputSliderDraggable = false;

    // setup slider state getter
    const getSliderState = () => {
      return inputSliderDraggable;
    };

    // setup slider mouseup handler
    const handleInputSliderMouseUp = (e) => {
      inputSliderDraggable = false;
    };

    // setup slider mouse down handler
    const handleInputSliderMouseDown = (e) => {
      inputSliderDraggable = true;
      handleInputSliderMouseMove(e);
      e.preventDefault();
    };

    // setup slider mouse move handler
    const handleInputSliderMouseMove = (event) => {
      if (!getSliderState()) {
        return;
      }

      // slider width, offset position, baroffsetleft, mouse position
      // calculare shim, mouse fix and bar position
      const sliderWidth = outerElWidth(inputSliderElement);
      const sliderOffsetLeft = inputSliderElement.getBoundingClientRect().left;
      const sliderBarOffsetLeft = inputSliderBar.getBoundingClientRect().left;
      const clientX = event.clientX;
      var barLeftPositionShim = (parseFloat(((clientX - sliderOffsetLeft) / sliderWidth) - 1).toFixed(2) * 17) * -1; // 17
      var barLeftPositionPercentage = ((clientX - barLeftPositionShim - sliderOffsetLeft) / sliderWidth) * inputSliderMax;
      var fixedDecimalAmount = 2;

      // fix invarience
      if (barLeftPositionPercentage > inputSliderMax || clientX > sliderOffsetLeft + sliderWidth) {
        barLeftPositionPercentage = inputSliderMax;
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
          const percentage = parseFloat(barLeftPositionPercentage).toFixed(fixedDecimalAmount);
          const tokenPrice = 0.125;
          const valueMax = inputSliderElement.dataset.valueMax;
          dataInputElement.value = String(new BigNumber(new BigNumber((new BigNumber(percentage)
                  .dividedBy(100)))
                  .times(new BigNumber(valueMax))
                  .dividedBy(tokenPrice)
                  .toFixed(0))
                  .times(tokenPrice));
        }

        // dispatch change event
        e = document.createEvent('HTMLEvents');
        e.initEvent('change', false, false);
        dataInputElement.dispatchEvent(e);
      }

      inputSliderBar.style.left = `${barLeftPositionPercentage}%`;
      inputSliderRailHighlight.style.width = `${barLeftPositionPercentage}%`;
    };

    // handle input change
    if (typeof inputSliderElement.dataset.inputId === 'string') {
      const dataInputElement = el(`#${inputSliderElement.dataset.inputId}`);

      // handle input element change
      const handleInputElementChange = () => {
        // const percentage = parseFloat(inputSliderBar.style.left).toFixed(2);
        const valueMax = inputSliderElement.dataset.valueMax || 0;
        const etherInput = new BigNumber(dataInputElement.value);
        // const unitEther = new BigNumber(etherInput.dividedBy(0.125).toFixed(0)).times(0.125);
        var inputElementValue = new BigNumber(etherInput)
            .dividedBy(valueMax).times(100);

        if (inputElementValue.gt(inputSliderMax)) {
          inputElementValue = new BigNumber(100);
        }

        if (inputElementValue.lt(0)) {
          inputElementValue = new BigNumber(0);
        }

        // set input slider bar left position
        inputSliderBar.style.left = `${inputElementValue.toString(10)}%`;
        inputSliderRailHighlight.style.width = `${inputElementValue.toString(10)}%`;
      };

      // instantiate initial handler default input
      handleInputElementChange({});

      // mouse move listener
      dataInputElement.addEventListener('change', handleInputElementChange, false);
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
