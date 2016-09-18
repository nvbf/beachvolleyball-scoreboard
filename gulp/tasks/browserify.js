var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var handleErrors = require('../util/handle-errors');


var browserifyTask = function() {
  return browserify({
    entries: './src/js/Router.js',
    debug: true
  })
    .transform("babelify", {presets: ["es2015", "react", "stage-0"]})
    .bundle()
    .on('error', handleErrors)
    .pipe(source('app.js'))
    .pipe(gulp.dest('./public/js/'));
};

gulp.task('browserify', ['clean'], browserifyTask);
