import canUseDOM from 'ember-in-viewport/utils/can-use-dom';

// Adapted from WC3's intersection polyfill
// https://github.com/w3c/IntersectionObserver/blob/master/polyfill/intersection-observer.js

function checkIntersectionObserver(window) {
  if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function () {
          return this.intersectionRatio > 0;
        }
      });
    }
    return true;
  }
  return false;
}
function canUseIntersectionObserver() {
  if (!canUseDOM) {
    return false;
  }
  return checkIntersectionObserver(window);
}

export { canUseIntersectionObserver as default };
//# sourceMappingURL=can-use-intersection-observer.js.map
