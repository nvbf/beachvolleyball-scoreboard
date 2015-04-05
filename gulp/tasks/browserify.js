var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var handleErrors = require('../util/handle-errors');
var reactify = require('reactify');
var envify = require('envify');
var babelify = require('babelify');
var production = process.env.NODE_ENV === 'production';


var browserifyTask = function() {
  return browserify({
    entries: './src/js/components/Router.js',
    debug: !production
  })
    .transform(envify)
    .transform(babelify)
    .transform(reactify)
    .bundle()
    .on('error', handleErrors)
    .pipe(source('app.js'))
    .pipe(gulp.dest('./public/js/'));
};

gulp.task('browserify', ['clean'], browserifyTask);
