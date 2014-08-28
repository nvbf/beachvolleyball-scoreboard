var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

function createSingleBundle(options) {
    browserify({
        entries: options.input,
        extensions: options.extensions
    })
        .bundle({debug: true})
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

gulp.task('default', function() {
    createBundles([
        {
            input: ['./client/js/app.js'],
            output: 'app.js',
            destination: './public/js/'
        }
/*        {
            input: ['./client/js/BootstrapButton.js'],
            output: 'app.js',
            destination: './public/js/'
        },
        {
            input: ['./client/js/BootstrapModal.js'],
            output: 'app.js',
            destination: './public/js/'
        },
        {
            input: ['./client/js/Example.js'],
            output: 'app.js',
            destination: './public/js/'
        }
*/
        ]
    );
});