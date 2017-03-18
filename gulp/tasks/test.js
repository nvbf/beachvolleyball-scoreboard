const gulp = require('gulp');
const babel = require('gulp-babel');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');
const isparta = require('isparta');

gulp.task('test', cb => {
	gulp.src(['./test/**.js', 'src/js/domain/**.js'])
    .pipe(babel())
    .pipe(istanbul({
	includeUntested: true,
	instrumenter: isparta.Instrumenter
}
    ))
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
	gulp.src(['test/*.js'])
        .pipe(babel())
        .pipe(mocha())
        .pipe(istanbul.writeReports({
	reporters: ['lcovonly']
}))
        .on('end', cb);
});
});
