var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var handleErrors = require('../util/handle-errors');

function createSingleBundle(options) {
    browserify({
        entries: options.input,
        extensions: options.extensions
    })
        .bundle({debug: true})
        .on('error', handleErrors)
        .pipe(source(options.output))
        .pipe(gulp.dest(options.destination));
}

function createBundles(bundles, markAsDoneCallback) {
    bundles.forEach(function (bundle) {
        createSingleBundle({
            input: bundle.input,
            output: bundle.output,
            extensions: bundle.extensions,
            destination: bundle.destination
        });
    });
    markAsDoneCallback();
}

gulp.task('browserify', function (markAsDoneCallback) {
    createBundles([
            {
                input: './client/js/App.js',
                output: 'app.js',
                destination: './public/js/'
            }
        ],
        markAsDoneCallback
    );
});