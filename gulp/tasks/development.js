const gulp = require('gulp');

const paths = ['src/**/*.js', 'src/**/*.css'];

gulp.task('watch', ['build'], () => {
	gulp.watch(paths, ['browserify', 'move-static']);
});

gulp.task('development', ['watch']);
