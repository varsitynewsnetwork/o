'use strict';

var config = require('../config');
var gulp = require('gulp');
var gulpWebpack = require('gulp-webpack');
var webpack = require('webpack');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('webpack', ['clean'], function() {
  return gulp.src(config.src.root + '/main.js')
    .pipe(gulpWebpack(config.webpack))
    .pipe(gulp.dest(config.dist.root))
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(config.dist.root));
});
