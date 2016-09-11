// calculate outer height off an element
const outerElHeight = function(el) {
  var height = el.offsetHeight;
  var style = getComputedStyle(el);

  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
  return height;
};

// buidl all nav togglesbuildAllNavToggles
const drawAllNavToggles = function() {
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

module.exports = drawAllNavToggles;
