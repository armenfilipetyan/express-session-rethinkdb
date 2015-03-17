
/*
 * Gulp Build File
 */

'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var bundle_version = require('./package.json').version;
var bundle_name = require('./package.json').name;

gulp.task('default', function() {
    return gulp.src('./lib/express-session-rethinkdb.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/express-session-rethinkdb-' + bundle_version ))
        .pipe(notify({ message: bundle_name + ' ' + bundle_version + ' build complete' }));
});

gulp.task('watch', function() {
    gulp.watch('./lib/express-session-rethinkdb.js', ['default']);
});
