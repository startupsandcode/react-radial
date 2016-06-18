"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Open a URL in a web browser
var browserify = require('browserify'); // Bundles JS
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var concat = require('gulp-concat'); //Concatenates files
var lint = require('gulp-eslint'); //Lint JS files, including JSX
var less = require('gulp-less'); //less generator 
var babelify = require('babelify');
var cleanCss = require('gulp-clean-css');

var config = {
	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		jsx: './src/**/*.jsx',
        js: './src/**/*.js',
		images: './src/images/*',
        less: './src/less/*.less',
		dist: './dist',
		mainJs: './src/main.jsx'
	}
}

//Start a local development server
gulp.task('connect', function() {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() {
	gulp.src('dist/index.html')
		.pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function() {
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('js', function() {
	browserify(config.paths.mainJs)
		.transform(babelify, {presets: ['es2015', 'react']})
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('less', function(){
    return gulp.src(config.paths.less)
        .pipe(less())
		.pipe(cleanCss())
        .pipe(gulp.dest(config.paths.dist + '/css'))
        .pipe(connect.reload()); 
});

gulp.task('watch', function() {
	gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.jsx, ['js']);
	gulp.watch(config.paths.js, ['js']);
    gulp.watch(config.paths.less, ['less']);
});

gulp.task('default', ['html', 'js', 'less', 'open', 'watch']);
