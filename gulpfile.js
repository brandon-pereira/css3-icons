var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');
var extender = require('gulp-html-extend');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');

var config = {
  'development': true
};

var paths = {
  // Files to transfer directly to dist
  'transfer': [
                './src/static/**/*'
                // ,'./path/to/folder.orFile'
              ],
  // distribution paths
  'dist': {
    'root': './dist',
    'all': './dist/**/*',
    'templates': './dist/templates'
  },
  // source files
  'src': {
    'css': './src/styles/style.scss',
    'html': './src/index.html',
    'js': './src/scripts/app.js',
    'templates': './src/scripts/templates/**/*',
    'graphics': './src/icons/*.svg'
  },
  // watch paths
  'watch': {
    'html': ['./src/index.html', './src/html/**/*.html'],
    'js': './src/scripts/**/*.js',
    'css': './src/**/*.scss',
    'templates': './src/scripts/templates/**/*',
    'graphics': './src/icons/*.svg'
  }
};

gulp.task('default', ['serve']);
gulp.task('serve', ['build', 'webserver']);
gulp.task('build', ['extend', 'style', 'script']);

/**
  This function will expand the index file (srcIndex) and 
  place the expanded source to the dist folder. Will also
  call for a live reload.
**/
gulp.task('extend', function () {
  return gulp.src(paths.src.html)
    .pipe(extender({annotations:false,verbose:false}))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});

/**
  This function will compile any SCSS files inside 
  paths.sec.scss, add sourcemaps, minify the css, and output
  it to the /dist folder. Will also call for a live reload.
**/
gulp.task('style', function() {
  return gulp.src(paths.src.css)
    .pipe(sass().on('error', errorCallback))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});
 
gulp.task('script', function() {
  return gulp.src(paths.src.js)
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});

/**
 * Task to directly transfer files listed in paths.transfer. Does no
 * modification to files.
 */
gulp.task('transfer', function(){
  return gulp.src(paths.transfer)
    .pipe(gulp.dest(paths.dist.root));
});


/**
  This function will watch path watch files for changes,
  and if changes are detected (via livereload command),
  will compile the changed file.
**/
gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(paths.watch.css, ['style']);
  gulp.watch(paths.watch.html, ['extend']);
  gulp.watch(paths.watch.js, ['script']);
  gulp.watch(paths.transfer, ['transfer']);
});

/**
  This function will turn on the web server,
  using /dist as base. Will  trigger livereload 
  on change.
**/
gulp.task('webserver', ['watch'], function() {
  return gulp.src(paths.dist.root)
    .pipe(webserver({
      livereload: true, 
      open: true
    }));
});

var errorCallback = function(err){
    gutil.log(gutil.colors.red('------ERROR------\n'+err.message));
    gutil.beep();
    this.emit('end');
};