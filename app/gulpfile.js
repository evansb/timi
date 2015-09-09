var gulp        = require('gulp');
var gutil       = require('gulp-util');
var browserify  = require('browserify');
var babelify    = require('babelify');
var bower       = require('bower');
var debowerify  = require('debowerify');
var concat      = require('gulp-concat');
var sass        = require('gulp-sass');
var minifyCss   = require('gulp-minify-css');
var rename      = require('gulp-rename');
var sourcemaps  = require('gulp-sourcemaps');
var sh          = require('shelljs');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var watchify    = require('watchify');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./src/**/*.js'],
  views: './views'
};

// Compile all the sass and minify it to single .min.css on the staging
gulp.task('sass', function(done) {
  gulp.src('./scss/*.scss')
    .pipe(sass({ style: 'compressed', errLogToConsole: true }))
    .pipe(minifyCss({ processImport: true, keepSpecialComments: 0 }))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('./dist'))
    .on('end', done);
});

// Babelify, bundle and watch javascript files.
gulp.task('browserify', function() {
  var config = {
    packageCache: {},
    cache: {},
    entries: ['./src/index.js'],
    debug: false
  };
  var babelifyConfig = { only: /src/ };
  var bundler = watchify(browserify(config));
  var sourcemap =
    sourcemaps.init({ loadMaps: true })
      .on('error', gutil.log)
  var rebundle = function() {
    console.log('Rebundling...');
    bundler.transform(babelify.configure(babelifyConfig))
      .transform(debowerify)
      .bundle()
      .on('error', gutil.log.bind(gutil, 'browserify error'))
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init(sourcemap))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'))
  };
  bundler.on('update', rebundle);
  rebundle();
});

// Watch for SASS changes
gulp.task('watch', function() {
  gulp.watch('./scss/**/*.scss', ['sass']);
});

// Autogenerated by Ionic, it is wise not to delete
gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

// Autogenerated by Ionic, it is wise not to delete
gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('default', ['sass', 'browserify', 'watch']);
