var gulp = require('gulp');

var paths = ['client/**/*.js', 'client/**/*.css'];

gulp.task('watch', ['build'], function () {
    gulp.watch(paths, ['build']);
});


gulp.task('development', ['watch'], function (callback) {
        callback();
    }
);