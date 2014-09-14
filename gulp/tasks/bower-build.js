var gulp = require('gulp');
var source = require('vinyl-source-stream');

function createSingleBundle(paths) {
        gulp.src(paths.input)
            .pipe(gulp.dest(paths.output));
}

function createBundles(bundles) {
    bundles.forEach(function (bundle) {
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