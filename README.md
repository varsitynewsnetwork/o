#o

[![Build Status](https://travis-ci.org/varsitynewsnetwork/o.svg?branch=master)](https://travis-ci.org/varsitynewsnetwork/o)

Simple promise observing for AngularJS.

## Usage
You can leverage the `PromiseObserver` and the `observing` directive by including the `vnn.o` module as a dependency.

```js
angular.module('mymodule', ['vnn.o']);
```

## PromiseObserver

The `PromiseObserver` service is used to monitor promises and associate a key with them so their status can be polled.

### PromiseObserver.prototype.observe

This method observes a promise and associates a key with it:

```js
app.controller('MyController', function (PromiseObserver, $http) {
  var promise = PromiseObserver.observe($http.get('/some.json'), 'key');
});
```

`PromiseObserver.observe` returns the promise being observed. This makes it easy to use in conjunction with most angular conventions, such as a resolve block.

Multiple promises can be assigned to the same key.

### PromiseObserver.prototype.resolving

The resolving method checks if all promises for a given key have finished resolving.

```js
app.controller('MyController', function (PromiseObserver, $http) {
  PromiseObserver.observe($http.get('/some.json'), 'key');
  PromiseObserver.observe($http.get('/some-other.json'), 'key');

  if (PromiseObserver.resolving('key')) {
    //do something if promises are still resolving
  }
});
```

### Events

The `PromiseObserver` emits the following events:

* `observing` - Notifies all listeners it has started observing a promise. Listeners receive the key being observed.
* `complete` - Notifies all listeners all promises have been resolved. Listeners receive the key of the resolved promises.

```js
app.controller('MyController', function (PromiseObserver, $http) {
  PromiseObserver.on('observing', function (key) {
    console.log("Observing ", key);
  });

  PromiseObserver.observe($http.get('/some.json'), 'key');

  PromiseObserver.on('complete', function (key) {
    console.log("All promises resolved for ", key);
  });
});
```
### $o

A handy shortcut exists for `PromiseObserver.observe` called `$o`.

```js
app.controller('MyController', function ($o, $http) {
  $o($http.get('/some.json'), 'key');
});
```

### The `observing` directive

o ships with an `observing` directive that makes it ideal for using in the UI - say for a loading graphic.

```html
<div observing='key'>
	Loading...
</div>
```

This directive simply adds a `promise-resolving` class to the element while promises for the given key are resolving. Once all promises for that key have resolved - the class is removed.

## Running tests

Tests use the karma test runner + jasmine. They can be run via an npm script.

```
$ npm i 
$ npm test
```
