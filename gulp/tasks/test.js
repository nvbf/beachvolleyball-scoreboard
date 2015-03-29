const gulp = require('gulp');
const istanbul = require('gulp-istanbul');
const istanbulHarmony = require('istanbul-harmony');
const mocha = require('gulp-mocha');

gulp.task('test', function(cb) {

  var usedIstanbul = require('gulp-istanbul')
  var Instrumenter = usedIstanbul.Instrumenter;
  // Overrides `Instrumenter`
  usedIstanbul.Instrumenter = istanbulHarmony.Instrumenter;

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
