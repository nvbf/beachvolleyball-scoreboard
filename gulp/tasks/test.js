var gulp = require('gulp'),
  istanbul = require('gulp-istanbul'),
  mocha = require('gulp-mocha');

gulp.task('test', function(cb) {
  gulp.src(['./test/**.js', 'src/js/domain/**.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(['test/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});
