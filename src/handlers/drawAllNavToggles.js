// document helper
import { el } from '../document';


function outerElHeight(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
}

// buidl all nav togglesbuildAllNavToggles
export default function drawAllNavToggles() {
  [].slice.call(document.querySelectorAll('.navbar-toggle')).forEach((navBarToggle) => {
    navBarToggle.addEventListener('click', () => {

      var toggleState = false;
      const toggleTarget = el(`#${navBarToggle.dataset.targetId}`);

      const getToggleState = () => {
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
}
