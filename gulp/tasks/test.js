var gulp = require('gulp');
var babel = require('gulp-babel');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var isparta = require('isparta');

gulp.task('test', function(cb) {
  gulp.src(['./test/**.js', 'src/js/domain/**.js'])
    .pipe(babel())
    .pipe(istanbul({
        includeUntested: true,
        instrumenter: isparta.Instrumenter
      }
    ))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(['test/*.js'])
        .pipe(babel())
        .pipe(mocha())
        .pipe(istanbul.writeReports({
          reporters: ['lcovonly']
        }))
        .on('end', cb);
    });
});
