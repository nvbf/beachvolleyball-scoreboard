var gulp = require('gulp');
var styleCheck = require('sol-style-check');

gulp.task('check-style', styleCheck(
  ['!coverage{,/**}', '!public/{,/**}'], 'esprima-fb'));
