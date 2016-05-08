var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var input = 'app/scss/**/*.scss';
var output = 'app/css';
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};
var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};
// var plumber = require('gulp-plumber');
// function customPlumber () {
//   return plumber({
//       errorHandler: function(err) {
//       // Logs error in console
//       console.log(err.stack);
//       // Ends the current pipe, so Gulp watch doesn't break this.emit('end');
//     }
//   });
// }

gulp.task('sass', function() {
  return gulp.src(input)
    // .pipe(customPlumber())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(output))
    .pipe(browserSync.reload({
      stream: true
    }))
});
var browserSync = require('browser-sync').create();
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

var cssnano = require('gulp-cssnano');
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

//cleaning up
var del = require('del');
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

var runSequence = require('run-sequence');
gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
});
