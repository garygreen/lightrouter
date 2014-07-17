var gulp = require('gulp'),
	clean = require('gulp-clean'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	header = require('gulp-header');

// Clean dist folder
gulp.task('clean', function() {
	return gulp.src('dist').pipe(clean());
});

// Copy
gulp.task('copy', function() {
	return gulp.src('src/lightrouter.js')
		.pipe(gulp.dest('dist'));
});

// Uglify / Compress
gulp.task('uglify', function() {
	return gulp.src('src/lightrouter.js')
		.pipe(uglify())
		.pipe(concat('lightrouter.min.js'))
		.pipe(header('/* lightrouter.js - Copyright 2014 Gary Green. Licensed under the Apache License, Version 2.0 */'))
 		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'copy', 'uglify']);