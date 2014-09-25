var gulp = require('gulp');
var source = require('vinyl-source-stream');
var handleErrors = require('../util/handle-errors');

function createSingleBundle(path) {
        gulp.src(path.input)
            .on('error', handleErrors)
            .pipe(gulp.dest(path.output));
}

function createBundles(bundles) {
    bundles.forEach(function (bundle) {
        console.log('from ' + bundle.input + ' to ' + bundle.output);
        createSingleBundle(bundle);
    });
}

gulp.task('bower-build', function () {
    createBundles([
            {
                input: './bower_components/bootstrap/dist/css/bootstrap.css',
                output: './public/css'
            },
            {
                input: './bower_components/bootstrapvalidator/dist/css/bootstrapValidator.css',
                output: './public/css'
            },
            {
                input: './client/css/app.css',
                output: './public/css'
            },
            {
                input: './bower_components/bootstrapvalidator/dist/js/bootstrapValidator.js',
                output: './public/js'
            },
            {
                input: './bower_components/bootstrapvalidator/dist/js/bootstrapValidator.js',
                output: './public/js'
            },
            {
                input: './bower_components/jquery/dist/jquery.js',
                output: './public/js'
            }
        ]
    );
});