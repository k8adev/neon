/* jshint esversion: 6 */

/**
 * General.
 */
const config = {
  path: {
    source: 'source',
    public: 'public'
  }
};
/**
 * Dependences.
 * @required {@link https://www.npmjs.com/package/gulp}
 * @required {@link https://www.npmjs.com/package/gulp-load-plugins}
 * @required {@link https://www.npmjs.com/package/browser-sync}
 */
const gulp = require('gulp');
const grun = require('gulp-load-plugins')({
  pattern: [
    'gulp-*'
  ]
});

const browserSync = require('browser-sync').create();
/**
 * HTML task.
 * @required {@link https://www.npmjs.com/package/gulp-pug}
 * @required {@link https://www.npmjs.com/package/browser-sync}
 */
gulp.task('html', () => {
  const gsrc = gulp.src(`${ config.path.source }/index.pug`);

  gsrc.pipe(grun.pug2());
  gsrc.pipe(gulp.dest(`${ config.path.public }`));
  gsrc.pipe(browserSync.stream());

  return gsrc;
});
/**
 * CSS task.
 * @required {@link https://www.npmjs.com/package/browser-sync}
 * @required {@link https://www.npmjs.com/package/gulp-sourcemaps}
 * @required {@link https://www.npmjs.com/package/gulp-stylus}
 * @required {@link https://www.npmjs.com/package/gulp-autoprefixer}
 * @required {@link https://www.npmjs.com/package/gulp-rename}
 */
gulp.task('css', () => {
  const gsrc = gulp.src(`${ config.path.source }/stylus/main.styl`);

  gsrc.pipe(grun.sourcemaps.init());
  gsrc.pipe(grun.stylus({
    compress: true
  }));
  gsrc.pipe(grun.autoprefixer());
  gsrc.pipe(grun.sourcemaps.write('.'));
  gsrc.pipe(grun.rename({
    suffix: '.min',
    extname: '.css'
  }));
  gsrc.pipe(gulp.dest(`${ config.path.public }/assets/css`));
  gsrc.pipe(browserSync.stream());

  return gsrc;
});
/**
 * JS task.
 * @required {@link https://www.npmjs.com/package/browser-sync}
 * @required {@link https://www.npmjs.com/package/gulp-sourcemaps}
 * @required {@link https://www.npmjs.com/package/gulp-rename}
 * @required {@link https://www.npmjs.com/package/gulp-babel}
 * @required {@link https://www.npmjs.com/package/gulp-uglify}
 */
gulp.task('js', () => {
  const gsrc = gulp.src(`${ config.path.source }/es6/main.js`);

  gsrc.pipe(grun.sourcemaps.init());
  gsrc.pipe(grun.babel());
  gsrc.pipe(grun.sourcemaps.write('.'));
  gsrc.pipe(grun.uglify());
  gsrc.pipe(grun.rename({
    suffix: '.min'
  }));
  gsrc.pipe(gulp.dest(`${ config.path.public }/assets/js`));
  gsrc.pipe(browserSync.stream());

  return gsrc;
});
/**
 * Server task.
* @required {@link https://www.npmjs.com/package/browser-sync}
 */
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: `${ config.path.public }`
    }
  });

  gulp.watch(`${ config.path.source }/**/*.js`, ['js']);
  gulp.watch(`${ config.path.source }/**/*.styl`, ['css']);
  gulp.watch(`${ config.path.source }/**/*.pug`, ['html']);
});
/**
 * Task for production.
 */
gulp.task('default', [
  'html',
  'css',
  'js'
]);
/**
 * Task for development.
 */
gulp.task('dev', [
  'default',
  'server'
]);
