var gulp = require('gulp'),
  paths = ['src/**/*.js', 'src/**/*.css'];

gulp.task('watch', ['build'], function() {
  gulp.watch(paths, ['build']);
});

gulp.task('development', ['watch']);
