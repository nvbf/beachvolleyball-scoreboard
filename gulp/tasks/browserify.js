var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var handleErrors = require('../util/handle-errors');
var reactify = require('reactify');
var envify = require('envify');
const es6ify = require('es6ify');
var production = process.env.NODE_ENV === 'production';


var browserifyTask = function() {
  return browserify({
    entries: './src/js/components/Router.js',
    debug: !production
  })
//    .add(es6ify.runtime)
    .transform(envify)
    .transform(reactify)
//    .transform(es6ify.configure(/^(?!.*node_modules)+.+\.js$/))
    .bundle()
    .on('error', handleErrors)
    .pipe(source('app.js'))
    .pipe(gulp.dest('./public/js/'));
};

gulp.task('browserify', ['clean'], browserifyTask);
