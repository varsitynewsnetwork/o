describe('observing', function () {
  beforeEach(angular.mock.module('vnn.o'));

  beforeEach(inject(function ($compile, $rootScope, $q, PromiseObserver) {
    this.$compile = $compile;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.deferred = this.$q.defer();
    this.observer = PromiseObserver;
    this.$scope = $rootScope.$new();
    PromiseObserver.observables = {};
  }));

  it('should place a promise-resolving class on it', function () {
    this.observer.observe(this.deferred.promise, 'team');
    var element = this.$compile('<div observing="team" />')(this.$scope);
    expect(element.hasClass('promise-resolving')).toBe(true);
  });

  it('should remove a promise-resolving class once the promise resolves', function () {
    this.observer.observe(this.deferred.promise, 'team');
    var element = this.$compile('<div observing="team" />')(this.$scope);
    this.deferred.resolve('hello');
    this.$rootScope.$digest();
    expect(element.hasClass('promise-resolving')).toBe(false);
  });

  it('should add a promise-resolving class when resolving starts again', function () {
    var element = this.$compile('<div observing="team" />')(this.$scope);
    this.observer.observe(this.deferred.promise, 'team');
    expect(element.hasClass('promise-resolving')).toBe(true);
  });

  it('should raise an error if no key is given', function () {
    var that = this;
    expect(function() {
      that.$compile('<div observing />')(that.$scope);
    }).toThrow(new Error("promise key is required"));
  });
});
