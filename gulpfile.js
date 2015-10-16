var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    header = require("gulp-header"),
    Server = require('karma').Server,
    coveralls = require('gulp-coveralls'),
    pkg = require('./package.json');

var banner = '/*  angular-summernote v<%=pkg.version%> | (c) 2014, 2015 JeongHoon Byun | MIT license */\n';
var isAngular12 = isAngular13 = false;

gulp.task('lint', function() {
  return gulp.src(['./src/**/*.js', './test/**/*.test.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('copy', function() {
  return gulp.src('./src/angular-summernote.js')
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['copy'], function() {
  return gulp.src('./src/angular-summernote.js')
    .pipe(uglify({mangle: false}))
    .pipe(rename({extname: '.min.js'}))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist'));
});

gulp.task('karma', function (done) {
  var configFile = '/test/karma.conf.js';
  if (isAngular12) { configFile = '/test/karma-angular-1-2-x.conf.js'; }
  if (isAngular13) { configFile = '/test/karma-angular-1-3-x.conf.js'; }

  new Server({
    configFile: __dirname + configFile,
    autoWatch: true
  }, done).start();
});

gulp.task('test', function() {
  gulp.start('karma');
});

gulp.task('test:angular12', function() {
  isAngular12 = true;
  gulp.start('karma');
});

gulp.task('test:angular13', function() {
  isAngular13 = true;
  gulp.start('karma');
});

gulp.task('travis', function(done) {
  var configFile = '/test/karma.conf.js';

  var coveralls = function() {
    gulp.src('coverage/**/lcov.info')
      .pipe(coveralls());
    done();
  }

  new Server({
    configFile: __dirname + configFile,
    singleRun: true,
    browsers: ['PhantomJS'],
    reporters: ['progress', 'coverage'],
    preprocessors: { '../**/src/**/*.js': 'coverage' },
    coverageReporter: { type: 'lcov', dir: '../coverage/' },
    plugins: [ 'karma-*' ]
  }, coveralls).start();
});
