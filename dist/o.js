/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//require deps
	__webpack_require__(4);
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function() {

	'use strict';

	angular.module('vnn.o', []);

	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5)(__webpack_require__(6))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(src) {
		if (typeof execScript === "function")
			execScript(src);
		else
			eval.call(null, src);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "/*!\n * EventEmitter2\n * https://github.com/hij1nx/EventEmitter2\n *\n * Copyright (c) 2013 hij1nx\n * Licensed under the MIT license.\n */\n;!function(undefined) {\n\n  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {\n    return Object.prototype.toString.call(obj) === \"[object Array]\";\n  };\n  var defaultMaxListeners = 10;\n\n  function init() {\n    this._events = {};\n    if (this._conf) {\n      configure.call(this, this._conf);\n    }\n  }\n\n  function configure(conf) {\n    if (conf) {\n\n      this._conf = conf;\n\n      conf.delimiter && (this.delimiter = conf.delimiter);\n      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);\n      conf.wildcard && (this.wildcard = conf.wildcard);\n      conf.newListener && (this.newListener = conf.newListener);\n\n      if (this.wildcard) {\n        this.listenerTree = {};\n      }\n    }\n  }\n\n  function EventEmitter(conf) {\n    this._events = {};\n    this.newListener = false;\n    configure.call(this, conf);\n  }\n\n  //\n  // Attention, function return type now is array, always !\n  // It has zero elements if no any matches found and one or more\n  // elements (leafs) if there are matches\n  //\n  function searchListenerTree(handlers, type, tree, i) {\n    if (!tree) {\n      return [];\n    }\n    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,\n        typeLength = type.length, currentType = type[i], nextType = type[i+1];\n    if (i === typeLength && tree._listeners) {\n      //\n      // If at the end of the event(s) list and the tree has listeners\n      // invoke those listeners.\n      //\n      if (typeof tree._listeners === 'function') {\n        handlers && handlers.push(tree._listeners);\n        return [tree];\n      } else {\n        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {\n          handlers && handlers.push(tree._listeners[leaf]);\n        }\n        return [tree];\n      }\n    }\n\n    if ((currentType === '*' || currentType === '**') || tree[currentType]) {\n      //\n      // If the event emitted is '*' at this part\n      // or there is a concrete match at this patch\n      //\n      if (currentType === '*') {\n        for (branch in tree) {\n          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {\n            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));\n          }\n        }\n        return listeners;\n      } else if(currentType === '**') {\n        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));\n        if(endReached && tree._listeners) {\n          // The next element has a _listeners, add it to the handlers.\n          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));\n        }\n\n        for (branch in tree) {\n          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {\n            if(branch === '*' || branch === '**') {\n              if(tree[branch]._listeners && !endReached) {\n                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));\n              }\n              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));\n            } else if(branch === nextType) {\n              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));\n            } else {\n              // No match on this one, shift into the tree but not in the type array.\n              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));\n            }\n          }\n        }\n        return listeners;\n      }\n\n      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));\n    }\n\n    xTree = tree['*'];\n    if (xTree) {\n      //\n      // If the listener tree will allow any match for this part,\n      // then recursively explore all branches of the tree\n      //\n      searchListenerTree(handlers, type, xTree, i+1);\n    }\n\n    xxTree = tree['**'];\n    if(xxTree) {\n      if(i < typeLength) {\n        if(xxTree._listeners) {\n          // If we have a listener on a '**', it will catch all, so add its handler.\n          searchListenerTree(handlers, type, xxTree, typeLength);\n        }\n\n        // Build arrays of matching next branches and others.\n        for(branch in xxTree) {\n          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {\n            if(branch === nextType) {\n              // We know the next element will match, so jump twice.\n              searchListenerTree(handlers, type, xxTree[branch], i+2);\n            } else if(branch === currentType) {\n              // Current node matches, move into the tree.\n              searchListenerTree(handlers, type, xxTree[branch], i+1);\n            } else {\n              isolatedBranch = {};\n              isolatedBranch[branch] = xxTree[branch];\n              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);\n            }\n          }\n        }\n      } else if(xxTree._listeners) {\n        // We have reached the end and still on a '**'\n        searchListenerTree(handlers, type, xxTree, typeLength);\n      } else if(xxTree['*'] && xxTree['*']._listeners) {\n        searchListenerTree(handlers, type, xxTree['*'], typeLength);\n      }\n    }\n\n    return listeners;\n  }\n\n  function growListenerTree(type, listener) {\n\n    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();\n\n    //\n    // Looks for two consecutive '**', if so, don't add the event at all.\n    //\n    for(var i = 0, len = type.length; i+1 < len; i++) {\n      if(type[i] === '**' && type[i+1] === '**') {\n        return;\n      }\n    }\n\n    var tree = this.listenerTree;\n    var name = type.shift();\n\n    while (name) {\n\n      if (!tree[name]) {\n        tree[name] = {};\n      }\n\n      tree = tree[name];\n\n      if (type.length === 0) {\n\n        if (!tree._listeners) {\n          tree._listeners = listener;\n        }\n        else if(typeof tree._listeners === 'function') {\n          tree._listeners = [tree._listeners, listener];\n        }\n        else if (isArray(tree._listeners)) {\n\n          tree._listeners.push(listener);\n\n          if (!tree._listeners.warned) {\n\n            var m = defaultMaxListeners;\n\n            if (typeof this._events.maxListeners !== 'undefined') {\n              m = this._events.maxListeners;\n            }\n\n            if (m > 0 && tree._listeners.length > m) {\n\n              tree._listeners.warned = true;\n              console.error('(node) warning: possible EventEmitter memory ' +\n                            'leak detected. %d listeners added. ' +\n                            'Use emitter.setMaxListeners() to increase limit.',\n                            tree._listeners.length);\n              console.trace();\n            }\n          }\n        }\n        return true;\n      }\n      name = type.shift();\n    }\n    return true;\n  }\n\n  // By default EventEmitters will print a warning if more than\n  // 10 listeners are added to it. This is a useful default which\n  // helps finding memory leaks.\n  //\n  // Obviously not all Emitters should be limited to 10. This function allows\n  // that to be increased. Set to zero for unlimited.\n\n  EventEmitter.prototype.delimiter = '.';\n\n  EventEmitter.prototype.setMaxListeners = function(n) {\n    this._events || init.call(this);\n    this._events.maxListeners = n;\n    if (!this._conf) this._conf = {};\n    this._conf.maxListeners = n;\n  };\n\n  EventEmitter.prototype.event = '';\n\n  EventEmitter.prototype.once = function(event, fn) {\n    this.many(event, 1, fn);\n    return this;\n  };\n\n  EventEmitter.prototype.many = function(event, ttl, fn) {\n    var self = this;\n\n    if (typeof fn !== 'function') {\n      throw new Error('many only accepts instances of Function');\n    }\n\n    function listener() {\n      if (--ttl === 0) {\n        self.off(event, listener);\n      }\n      fn.apply(this, arguments);\n    }\n\n    listener._origin = fn;\n\n    this.on(event, listener);\n\n    return self;\n  };\n\n  EventEmitter.prototype.emit = function() {\n\n    this._events || init.call(this);\n\n    var type = arguments[0];\n\n    if (type === 'newListener' && !this.newListener) {\n      if (!this._events.newListener) { return false; }\n    }\n\n    // Loop through the *_all* functions and invoke them.\n    if (this._all) {\n      var l = arguments.length;\n      var args = new Array(l - 1);\n      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];\n      for (i = 0, l = this._all.length; i < l; i++) {\n        this.event = type;\n        this._all[i].apply(this, args);\n      }\n    }\n\n    // If there is no 'error' event listener then throw.\n    if (type === 'error') {\n\n      if (!this._all &&\n        !this._events.error &&\n        !(this.wildcard && this.listenerTree.error)) {\n\n        if (arguments[1] instanceof Error) {\n          throw arguments[1]; // Unhandled 'error' event\n        } else {\n          throw new Error(\"Uncaught, unspecified 'error' event.\");\n        }\n        return false;\n      }\n    }\n\n    var handler;\n\n    if(this.wildcard) {\n      handler = [];\n      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();\n      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);\n    }\n    else {\n      handler = this._events[type];\n    }\n\n    if (typeof handler === 'function') {\n      this.event = type;\n      if (arguments.length === 1) {\n        handler.call(this);\n      }\n      else if (arguments.length > 1)\n        switch (arguments.length) {\n          case 2:\n            handler.call(this, arguments[1]);\n            break;\n          case 3:\n            handler.call(this, arguments[1], arguments[2]);\n            break;\n          // slower\n          default:\n            var l = arguments.length;\n            var args = new Array(l - 1);\n            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];\n            handler.apply(this, args);\n        }\n      return true;\n    }\n    else if (handler) {\n      var l = arguments.length;\n      var args = new Array(l - 1);\n      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];\n\n      var listeners = handler.slice();\n      for (var i = 0, l = listeners.length; i < l; i++) {\n        this.event = type;\n        listeners[i].apply(this, args);\n      }\n      return (listeners.length > 0) || !!this._all;\n    }\n    else {\n      return !!this._all;\n    }\n\n  };\n\n  EventEmitter.prototype.on = function(type, listener) {\n\n    if (typeof type === 'function') {\n      this.onAny(type);\n      return this;\n    }\n\n    if (typeof listener !== 'function') {\n      throw new Error('on only accepts instances of Function');\n    }\n    this._events || init.call(this);\n\n    // To avoid recursion in the case that type == \"newListeners\"! Before\n    // adding it to the listeners, first emit \"newListeners\".\n    this.emit('newListener', type, listener);\n\n    if(this.wildcard) {\n      growListenerTree.call(this, type, listener);\n      return this;\n    }\n\n    if (!this._events[type]) {\n      // Optimize the case of one listener. Don't need the extra array object.\n      this._events[type] = listener;\n    }\n    else if(typeof this._events[type] === 'function') {\n      // Adding the second element, need to change to array.\n      this._events[type] = [this._events[type], listener];\n    }\n    else if (isArray(this._events[type])) {\n      // If we've already got an array, just append.\n      this._events[type].push(listener);\n\n      // Check for listener leak\n      if (!this._events[type].warned) {\n\n        var m = defaultMaxListeners;\n\n        if (typeof this._events.maxListeners !== 'undefined') {\n          m = this._events.maxListeners;\n        }\n\n        if (m > 0 && this._events[type].length > m) {\n\n          this._events[type].warned = true;\n          console.error('(node) warning: possible EventEmitter memory ' +\n                        'leak detected. %d listeners added. ' +\n                        'Use emitter.setMaxListeners() to increase limit.',\n                        this._events[type].length);\n          console.trace();\n        }\n      }\n    }\n    return this;\n  };\n\n  EventEmitter.prototype.onAny = function(fn) {\n\n    if (typeof fn !== 'function') {\n      throw new Error('onAny only accepts instances of Function');\n    }\n\n    if(!this._all) {\n      this._all = [];\n    }\n\n    // Add the function to the event listener collection.\n    this._all.push(fn);\n    return this;\n  };\n\n  EventEmitter.prototype.addListener = EventEmitter.prototype.on;\n\n  EventEmitter.prototype.off = function(type, listener) {\n    if (typeof listener !== 'function') {\n      throw new Error('removeListener only takes instances of Function');\n    }\n\n    var handlers,leafs=[];\n\n    if(this.wildcard) {\n      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();\n      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);\n    }\n    else {\n      // does not use listeners(), so no side effect of creating _events[type]\n      if (!this._events[type]) return this;\n      handlers = this._events[type];\n      leafs.push({_listeners:handlers});\n    }\n\n    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {\n      var leaf = leafs[iLeaf];\n      handlers = leaf._listeners;\n      if (isArray(handlers)) {\n\n        var position = -1;\n\n        for (var i = 0, length = handlers.length; i < length; i++) {\n          if (handlers[i] === listener ||\n            (handlers[i].listener && handlers[i].listener === listener) ||\n            (handlers[i]._origin && handlers[i]._origin === listener)) {\n            position = i;\n            break;\n          }\n        }\n\n        if (position < 0) {\n          continue;\n        }\n\n        if(this.wildcard) {\n          leaf._listeners.splice(position, 1);\n        }\n        else {\n          this._events[type].splice(position, 1);\n        }\n\n        if (handlers.length === 0) {\n          if(this.wildcard) {\n            delete leaf._listeners;\n          }\n          else {\n            delete this._events[type];\n          }\n        }\n        return this;\n      }\n      else if (handlers === listener ||\n        (handlers.listener && handlers.listener === listener) ||\n        (handlers._origin && handlers._origin === listener)) {\n        if(this.wildcard) {\n          delete leaf._listeners;\n        }\n        else {\n          delete this._events[type];\n        }\n      }\n    }\n\n    return this;\n  };\n\n  EventEmitter.prototype.offAny = function(fn) {\n    var i = 0, l = 0, fns;\n    if (fn && this._all && this._all.length > 0) {\n      fns = this._all;\n      for(i = 0, l = fns.length; i < l; i++) {\n        if(fn === fns[i]) {\n          fns.splice(i, 1);\n          return this;\n        }\n      }\n    } else {\n      this._all = [];\n    }\n    return this;\n  };\n\n  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;\n\n  EventEmitter.prototype.removeAllListeners = function(type) {\n    if (arguments.length === 0) {\n      !this._events || init.call(this);\n      return this;\n    }\n\n    if(this.wildcard) {\n      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();\n      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);\n\n      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {\n        var leaf = leafs[iLeaf];\n        leaf._listeners = null;\n      }\n    }\n    else {\n      if (!this._events[type]) return this;\n      this._events[type] = null;\n    }\n    return this;\n  };\n\n  EventEmitter.prototype.listeners = function(type) {\n    if(this.wildcard) {\n      var handlers = [];\n      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();\n      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);\n      return handlers;\n    }\n\n    this._events || init.call(this);\n\n    if (!this._events[type]) this._events[type] = [];\n    if (!isArray(this._events[type])) {\n      this._events[type] = [this._events[type]];\n    }\n    return this._events[type];\n  };\n\n  EventEmitter.prototype.listenersAny = function() {\n\n    if(this._all) {\n      return this._all;\n    }\n    else {\n      return [];\n    }\n\n  };\n\n  if (typeof define === 'function' && define.amd) {\n     // AMD. Register as an anonymous module.\n    define(function() {\n      return EventEmitter;\n    });\n  } else if (typeof exports === 'object') {\n    // CommonJS\n    exports.EventEmitter2 = EventEmitter;\n  }\n  else {\n    // Browser global.\n    window.EventEmitter2 = EventEmitter;\n  }\n}();\n"

/***/ }
/******/ ]);