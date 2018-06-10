/* eslint max-len: 0 */
import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import path from 'path';
import plugins from './postcss';

const dir = '.';

const folders = {
  css: {
    src: `${dir}/client/css/`,
    dist: `${dir}/public/css/`,
  },
  js: {
    src: `${dir}/client/js/`,
    dist: `${dir}/public/js/`,
  },
  html: {
    src: `${dir}/client/`,
    dist: `${dir}/public/`,
  },
};

const {
  postcss,
  rename,
  plumber,
  notify,
  watch,
} = loadPlugins();

const plumberOptions = {
  errorHandler: notify.onError('Error: Some troubles!'),
};

gulp.task('css:compile', () =>
  gulp.src(`${folders.css.src}main.css`)
    .pipe(plumber(plumberOptions))
    .pipe(postcss(plugins(folders)))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(folders.css.dist)));

gulp.task('js:compile', () =>
  gulp.src(`${folders.js.src}index.js`)
    .pipe(plumber(plumberOptions))
    .pipe(rename('main.js'))
    .pipe(gulp.dest(folders.js.dist)));

gulp.task('html', () => {
  gulp.src(`${folders.html.src}*.html`)
    .pipe(plumber(plumberOptions))
    .pipe(gulp.dest(folders.html.dist));
});

gulp.task('build', ['css:compile', 'js:compile', 'html']);

gulp.task('default', ['css:compile', 'js:compile', 'html'], () => {
  gulp.watch(`${folders.css.src}**/*.css`, ['css:compile']);
  gulp.watch(`${folders.js.src}**/*.js`, ['js:compile']);
  gulp.watch(`${folders.html.src}*.html`, ['html']);
});
