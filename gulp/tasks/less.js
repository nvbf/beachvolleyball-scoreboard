var gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    handleErrors = require('../util/handle-errors');

gulp.task('less', function() {
    return gulp.src('client/css/material.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error', handleErrors)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css/'));
});