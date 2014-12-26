var gulp = require('gulp');

gulp.task('build', ['test', 'move-static', 'browserify']);
