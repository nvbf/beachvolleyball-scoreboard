var gulp = require('gulp');

gulp.task('build', ['check-style', 'test', 'move-static', 'browserify']);
