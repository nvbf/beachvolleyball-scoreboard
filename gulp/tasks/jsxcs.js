var gulp = require('gulp'),
    jsxcs = require('gulp-jsxcs');

gulp.task('codestyle', function() {
  return gulp.src('client/js/App.js')
        .pipe(jsxcs());
});
