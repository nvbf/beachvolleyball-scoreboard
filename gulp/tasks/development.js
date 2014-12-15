var gulp = require('gulp');

var paths = ['client/**/*.js', 'client/**/*.css'];

gulp.task('watch', function () {
    gulp.watch(paths, ['browserify']);
});


gulp.task('development', ['watch', 'view-lib-build', 'less'], function (callback) {
        callback();
    }
);