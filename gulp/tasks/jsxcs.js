var gulp = require('gulp'),
    jsxcs = require('gulp-jsxcs');

gulp.task('codestyle', function() {
  return gulp.src('src/js/App.js')
        .pipe(jsxcs());
});
