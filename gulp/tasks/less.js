var gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    handleErrors = require('../util/handle-errors');

gulp.task('less', function() {
    return gulp.src('client/css/material.less')
        .pipe(less())
        .on('error', handleErrors)
        .pipe(gulp.dest('public/css/'));
});