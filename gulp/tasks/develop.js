var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('develop', function (){
    nodemon({ script: 'app.js', ext: 'js', ignore: ['public/**', 'node_modules/**', '.idea/**'] })
    .on('restart', ['build']);
});