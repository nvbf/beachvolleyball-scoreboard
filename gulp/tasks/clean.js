var gulp = require('gulp'),
  del = require('del');

gulp.task('clean', function(cb) {
  return del([
    'public//**'
  ], cb);
});
