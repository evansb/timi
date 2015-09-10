var gulp        = require('gulp');
var gutil       = require('gulp-util');
var babel       = require('gulp-babel');
var nodemon     = require('gulp-nodemon');
var sourcemaps  = require('gulp-sourcemaps');
var watch       = require('gulp-watch');

// Babelify, bundle and watch javascript files.
gulp.task('compile', function() {
  gulp.src('./src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('js'))
});

// Start the server
gulp.task('serve', function() {
  nodemon({
    script: 'js/main.js',
    tasks: ['compile'],
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  });
});

// Watch for changes
gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['compile']);
});

gulp.task('watchSharon', function() {
  watch('./src/**/*.js', ['compile']);
});

gulp.task('sharon', ['compile', 'watch' ]);
gulp.task('default', ['compile', 'watch', 'serve']);
