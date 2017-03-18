const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const handleErrors = require('../util/handle-errors');
const reactify = require('reactify');
const envify = require('envify');
const babelify = require('babelify');
const production = process.env.NODE_ENV === 'production';

const browserifyTask = function () {
	return browserify({
		entries: './src/js/components/router.js',
		debug: !production
	})
    .transform(envify)
    .transform(babelify)
    .transform(reactify)
    .bundle()
    .on('error', handleErrors)
    .pipe(source('app.js'))
    .pipe(gulp.dest('./public/js/'));
};

gulp.task('browserify', ['clean'], browserifyTask);
