var gulp = require('gulp');
var styleCheck = require('sol-style-checker');

gulp.task('check-style', styleCheck(
  ['!coverage{,/**}', '!public/{,/**}'], 'esprima-fb'));
