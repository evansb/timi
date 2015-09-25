var gulp        = require('gulp');
var babel       = require('gulp-babel');
var nodemon     = require('gulp-nodemon');
var sourcemaps  = require('gulp-sourcemaps');
var exec        = require('child_process').exec;

var envDevel = {
  'NODE_ENV': 'development',
  'API_HOST': 'localhost',
  'API_PORT': '8000',
  'DB_HOST': 'localhost',
  'PGPORT': '5432',
  'PRIVATE_KEY': 'opensesame',
  'DB_USER': process.env.USER,
  'DB_NAME': 'timi',
  'PG_DATA': './data'
};

var envProduction = {
  'NODE_ENV': 'development',
  'API_HOST': 'localhost',
  'API_PORT': '8000',
  'DB_HOST': 'localhost',
  'PGPORT': '5432',
  'PRIVATE_KEY': 'opensesame',
  'DB_USER': process.env.USER,
  'DB_PASSWORD': 'opensesame',
  'DB_NAME': 'timi',
  'PG_DATA': './data'
};

var envDevelSharon = {
  'NODE_ENV': 'development',
  'API_HOST': 'localhost',
  'API_PORT': '8000',
  'DB_HOST': 'localhost',
  'PGPORT': '5432',
  'PRIVATE_KEY': 'opensesame',
  'DB_USER': 'postgres',
  'DB_PASSWORD': 'root',
  'DB_NAME': 'timi',
  'PG_DATA': './data',
};

// Babelify, bundle and watch javascript files.
gulp.task('compile', function() {
  gulp.src('./src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('js'));
});

gulp.task('db-init-devel', function(done) {
  exec('./init_db.sh', {env: envDevel}, function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done();
  });
});

// Start the server
gulp.task('serve', [], function() {
  nodemon({
    script: 'js/main.js',
    tasks: ['compile'],
    ext: 'js',
    env: envDevel
  });
});

gulp.task('production', [], function() {
  nodemon({
    script: 'js/main.js',
    tasks: [],
    ext: 'js',
    env: envProduction
  });
});

gulp.task('serveSharon', [], function() {
  nodemon({
    script: 'js/main.js',
    tasks: ['compile'],
    ext: 'js',
    env: envDevelSharon
  });
});

// Watch for changes
gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['compile']);
});

gulp.task('sharon', ['watch' ]);
gulp.task('default', ['watch', 'serve']);
