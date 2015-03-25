'use strict';

var config = require('../config');
var gulp  = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src([
    config.src.root + '/*.js',
    config.src.root + '/**/*.js',
    '!' + config.src.root + '/*_test.js',
    '!' + config.src.root + '/**/*_test.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
