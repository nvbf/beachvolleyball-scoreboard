var gulp = require('gulp');

var paths = ['client/**/*.js', 'client/**/*.css'];

gulp.task('watch', function() {
    gulp.watch(paths, ['browserify']);
});


gulp.task('development', ['watch', 'browserify']);