describe('PromiseObserver', function () {

  beforeEach(angular.mock.module('vnn.o'));

  beforeEach(inject(function ($q, $rootScope, PromiseObserver) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.observer = PromiseObserver;
    this.observer.observables = {};
    this.deferred = $q.defer();
  }));

  describe('.observe()', function () {
    it('should register a key for the promise', function () {
      this.observer.observe(this.deferred.promise, 'school');
      expect(this.observer.observables['school'][0]).toEqual(this.deferred.promise);
    });

    it('should return the observed promise', function () {
      var promise = this.observer.observe(this.deferred.promise, 'school');
      expect(promise).toEqual(this.deferred.promise);
    });

    it('should emit an observing event', function () {
      var observing = false;
      this.observer.on('observing', function (key) {
        observing = key;
      });
      this.observer.observe(this.deferred.promise, 'school');
      expect(observing).toBe('school');
    });

    it('should register a finally step on the promise to remove it from the collection', function () {
      this.observer.observe(this.deferred.promise, 'school');
      this.deferred.resolve('hello!');
      this.$rootScope.$digest();
      expect(this.observer.observables['school'].length).toBe(0);
    });

    it('should emit a complete event when resolved or rejected', function () {
      var observing = false;
      this.observer.on('complete', function (key) {
        observing = key;
      });
      this.observer.observe(this.deferred.promise, 'school');
      this.deferred.resolve('hello!');
      this.$rootScope.$digest();
      expect(observing).toBe('school');
    });

    it('should monitor multiple promises on the same key', function () {
      var deferred = this.$q.defer();
      this.observer.observe(this.deferred.promise, 'school');
      this.observer.observe(deferred.promise, 'school');
      this.deferred.resolve('hello!');
      deferred.resolve('goodbye!');
      this.$rootScope.$digest();
      expect(this.observer.observables['school'].length).toBe(0);
    });

    it('should have a shorthand alias of $o', inject(function ($o) {
      var promise = $o(this.deferred.promise);
      expect(promise).toEqual(this.deferred.promise);
    }));
  });

  describe('.resolving()', function () {
    it('should return true if a promise exists in the observables list', function () {
      this.observer.observe(this.deferred.promise, 'school');
      expect(this.observer.resolving('school')).toBe(true);
    });

    it('should return false if there are no promises for a key', function () {
      this.observer.observe(this.deferred.promise, 'school');
      this.deferred.resolve('hello');
      this.$rootScope.$digest();
      expect(this.observer.resolving('school')).toBe(false);
    });

    it('should return false if key does not exist', function () {
      expect(this.observer.resolving('nope')).toBe(false);
    });
  });
});
