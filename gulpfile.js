/**
 * Paths.
 */
const path = {
  source: 'source',
  public: 'public'
};
/**
 * Dependences.
 */
const gulp = require('gulp');
const grun = require('gulp-load-plugins')({
  pattern: [
    'gulp-*',
    '*-stylus'
  ]
});

const browserSync = require('browser-sync').create();
/**
 * HTML task.
 */
gulp.task('html', () => {
  const gsrc = gulp.src(`${ path.source }/index.pug`);

  gsrc.pipe(grun.pug2());
  gsrc.pipe(gulp.dest(`${ path.public }`));
  gsrc.pipe(browserSync.stream());

  return gsrc;
});
/**
 * Fonts task.
 */
gulp.task('fonts', () => {
  const gsrc = gulp.src(`${ path.source }/fonts/**/*.*`);

  gsrc.pipe(gulp.dest(`${ path.public }/assets/fonts`));

  return gsrc;
});
/**
 * Images task.
 */
gulp.task('images', () => {
  const gsrc = gulp.src(`${ path.source }/images/**/*.*`);

  gsrc.pipe(gulp.dest(`${ path.public }/assets/images`));

  return gsrc;
});
/**
 * CSS task.
 */
gulp.task('css', () => {
  const gsrc = gulp.src(`${ path.source }/stylus/main.styl`);

  gsrc.pipe(grun.plumber());
  gsrc.pipe(grun.sourcemaps.init());
  gsrc.pipe(grun.stylus({
    compress: true,
    use: grun.autoprefixerStylus()
  }).on('error', error => {
    console.log(error.message);
  }));
  gsrc.pipe(grun.sourcemaps.write('.'));
  gsrc.pipe(grun.rename({
    suffix: '.min',
    extname: '.css'
  }));
  gsrc.pipe(gulp.dest(`${ path.public }/assets/css`));
  gsrc.pipe(grun.plumber.stop());
  gsrc.pipe(browserSync.stream());

  return gsrc;
});
/**
 * JS task.
 */
gulp.task('js', () => {
  const gsrc = gulp.src(`${path.source}/es6/main.js`);

  gsrc.pipe(grun.plumber());
  gsrc.pipe(grun.sourcemaps.init());
  gsrc.pipe(grun.babel());
  gsrc.pipe(grun.sourcemaps.write('.'));
  gsrc.pipe(grun.uglify());
  gsrc.pipe(grun.rename({
    suffix: '.min'
  }));
  gsrc.pipe(gulp.dest(`${ path.public }/assets/js`));
  gsrc.pipe(grun.plumber.stop());
  gsrc.pipe(browserSync.stream());

  return gsrc;
});
/**
 * JS polyfills task.
 */
gulp.task('js:polyfill', () => {
  const gsrc = gulp.src('./node_modules/picturefill/dist/picturefill.js');

  gsrc.pipe(grun.uglify());
  gsrc.pipe(grun.rename({
    basename: 'polyfill',
    suffix: '.min'
  }));
  gsrc.pipe(gulp.dest(`${ path.public }/assets/js`));

  return gsrc;
});
/**
 * Server task.
 */
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: `${ path.public }`
    }
  });

  gulp.watch(`${ path.source }/**/*.js`, ['js']);
  gulp.watch(`${ path.source }/**/*.styl`, ['css']);
  gulp.watch(`${ path.source }/**/*.pug`, ['html']);
});
/**
 * Task for production.
 */
gulp.task('default', [
  'html',
  'fonts',
  'images',
  'css',
  'js',
  'js:polyfill'
]);
/**
 * Task for development.
 */
gulp.task('dev', [
  'default',
  'server'
]);
