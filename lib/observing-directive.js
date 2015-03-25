(function () {

'use strict';

ObservingController.$inject = ['PromiseObserver'];
function ObservingController(observer) {
  this.observer = observer;
}

/**
 * Check if a promise or promises identified by key are resolving.
 *
 * @param {string} key
 * @return {boolean}
 */
ObservingController.prototype.resolving = function(key) {
  return this.observer.resolving(key);
};

/**
 * When promise state identified by a key emits an event - update
 * the class of the given element.
 *
 * @param {object} $elem
 * @param {string} key
 */
ObservingController.prototype.watchElem = function($elem, key) {
  this.observer.on('complete', function (complete) {
    if (key === complete) {
      $elem.removeClass('promise-resolving');
    }
  });
  this.observer.on('observing', function (observing) {
    if (key === observing) {
      $elem.addClass('promise-resolving');
    }
  });
};

var observing = {
  restrict: 'A',
  controller: ObservingController,
  link: function ($scope, $elem, $attrs, $ctrl) {
    var key = $attrs.observing;

    if (!key) {
      throw new Error("promise key is required");
    }

    var resolving = $ctrl.resolving(key);
    if (resolving) {
      $elem.addClass('promise-resolving');
    }
    $ctrl.watchElem($elem, key);
  }
};

angular.module('vnn.o')
  .directive('observing', function () {
    return observing;
  });

})();
