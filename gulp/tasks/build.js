var gulp = require('gulp');

gulp.task('build', [ 'view-lib-build', 'less', 'browserify']);