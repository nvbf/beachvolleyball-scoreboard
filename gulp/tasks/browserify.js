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

function createBundles(bundles) {
    bundles.forEach(function (bundle) {
        createSingleBundle({
            input: bundle.input,
            output: bundle.output,
            extensions: bundle.extensions,
            destination: bundle.destination
        });
    });
}

gulp.task('browserify', function() {
    createBundles([
        {
            input: ['./client/js/App.js'],
            output: 'app.js',
            destination: './public/js/'
        },
            {
                input: ['./client/js/BootstrapButton.js'],
                output: 'app.js',
                destination: './public/js/'
            },
            {
                input: ['./client/js/Head.js'],
                output: 'app.js',
                destination: './public/js/'
            }

        ]
    );
});