var path = require('path');

var vendor = [
  'node_modules/angular/angular.js',
  'node_modules/angular-*/angular-*.js'
];

var src = ['dist/o.min.js'];

var test = [
  'lib/**/*_test.js'
];

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ['jasmine'],
    files: vendor.concat(src).concat(test),
    autoWatch: true,
    browsers: ['PhantomJS'],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ]
  });
};
