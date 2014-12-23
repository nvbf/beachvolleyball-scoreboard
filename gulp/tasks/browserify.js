var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var handleErrors = require('../util/handle-errors');
var reactify = require('reactify');
var envify = require('envify');
var production = process.env.NODE_ENV === 'production';


var browserifyTask = function (markAsDoneCallback) {

    browserify({
        entries: './client/js/App.js',
        debug: !production
    })
        .transform(envify)
        .transform(reactify)
        .bundle()
        .on('error', handleErrors)
        .pipe(source('app.js'))
        .pipe(gulp.dest('./public/js/'));
    markAsDoneCallback();
};

gulp.task('browserify', ['clean'], browserifyTask);


