(function (global) {

'use strict';

/**
 * Return a comparator function for comparing promises.
 *
 * @param {object}
 * @return {function}
 */
function comparator(promise) {
  return function (p) {
    return p !== promise;
  }
}

function PromiseObserver() {
  this.observables = {};
  global.EventEmitter2.call(this);
}
PromiseObserver.prototype = Object.create(global.EventEmitter2.prototype);

/**
 * Observe a promise and associated it with the given key. Multiple promises
 * can be associated with the same key.
 * 
 * @param {object} promise
 * @param {string} key
 * @return {object}
 */
PromiseObserver.prototype.observe = function(promise, key) {
  if (! this.observables.hasOwnProperty(key)) {
    this.observables[key] = [];
  }

  var that = this;
  this.emit('observing', key);
  promise.finally(function () {
    that.update(promise, key);
  });

  this.observables[key].push(promise);
  return promise;
};

/**
 * Check if the given promise has resolved for the key. If it has, the internal
 * observables collection will be updated and an event emitted if all promises
 * for the given key have resolved.
 *
 * @param {object} promise
 * @param {string} key
 */
PromiseObserver.prototype.update = function (promise, key) {
  this.observables[key] = this.observables[key].filter(comparator(promise));
  if (! this.resolving(key)) {
    this.emit('complete', key);
  }
};

/**
 * Return whether or not a promise or promises identified by 
 * key are currently resolving.
 *
 * @param {string} key
 * @return {boolean}
 */
PromiseObserver.prototype.resolving = function(key) {
  if (! this.observables.hasOwnProperty(key)) {
    return false;
  }

  return this.observables[key].length > 0;
};

/**
 * A factory for the $o alias for PromiseObserver.observe.
 *
 * @param {object} observer
 * @return {function}
 */
function factory(observer) {
  return function(promise, key) {
    return observer.observe(promise, key);
  }
};
factory.$inject = ['PromiseObserver'];

angular.module('vnn.o')
  .constant('PromiseObserver', new PromiseObserver())
  .factory('$o', factory);

})(window);
