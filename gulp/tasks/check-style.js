var gulp = require('gulp');
var styleCheck = require('sol-style-check');

gulp.task('style-check', styleCheck('', 'node_modules/sol-style-check/lib/jscs/react.jscsrc'));
