var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var filesize = require('gulp-filesize');
var watch = require('gulp-watch');
var ngAnnotate = require('gulp-ng-annotate');

var srcDir = 'app';
var buildDir = 'build'

gulp.task('clean', function () {
    return gulp.src('build', {
            read: false
        })
        .pipe(clean());
});

gulp.task('vendor', function () {
    return gulp.src(srcDir + '/bower_components/*.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(rename('vendor.min.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(filesize())
        .on('error', gutil.log)
});

gulp.task('js', function () {
    return gulp.src(srcDir + '/client/**/*.js')
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest(buildDir))
        .pipe(filesize())
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest(buildDir))
        .pipe(filesize())
        .on('error', gutil.log)
});