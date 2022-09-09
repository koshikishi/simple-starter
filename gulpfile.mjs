import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import postcssNormalize from 'postcss-normalize';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import rename from 'gulp-rename';
import pug from 'gulp-pug';
import htmlmin from 'gulp-html-minifier-terser';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.mjs';
import squoosh from 'gulp-libsquoosh';
import path from 'path';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import {deleteAsync} from 'del';
import {create as bsCreate} from 'browser-sync';

const {src, dest, watch, series, parallel} = gulp;
const browserSync = bsCreate();

// Paths to files
const PATHS = {
  src: {
    root: 'source',
    styles: 'source/sass',
    js: 'source/js',
    images: 'source/img',
    icons: 'source/img/icons',
    favicons: 'source/img/favicons',
    fonts: 'source/fonts',
  },
  build: {
    root: 'build',
    styles: 'build/css',
    js: 'build/js',
    images: 'build/img',
  },
};

// Compiling *.css files from *.scss with autoprefixer and minification
const sass = gulpSass(dartSass);

export const styles = () => src(`${PATHS.src.styles}/style.scss`)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    postcssNormalize(),
    postcssPresetEnv({
      features: {
        'focus-visible-pseudo-class': false,
        'focus-within-pseudo-class': false,
        'overflow-wrap-property': {
          method: 'copy',
        },
        'system-ui-font-family': false,
      },
    }),
    autoprefixer(),
    cssnano(),
  ]))
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(dest(PATHS.build.styles))
  .pipe(browserSync.stream());

// Compiling *.html files from *.pug with minification
export const html = () => src(`${PATHS.src.root}/*.pug`)
  .pipe(pug())
  .pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
  }))
  .pipe(dest(PATHS.build.root));

// Transpilation and minification of *.js script files
export const scripts = () => src(`${PATHS.src.js}/main.js`)
  .pipe(webpack(webpackConfig))
  .pipe(dest(PATHS.build.js));

// Compressing raster image files with generation of *.webp format
export const optimizeImages = () => src(`${PATHS.src.images}/**/*.{png,jpg}`)
  .pipe(squoosh((file) => ({
    encodeOptions: {
      ...(path.dirname(file.path).split(path.sep).pop() === 'favicons' ? {} : {
        webp: {
          quality: 90,
          method: 6,
        },
      }),
      ...(path.extname(file.path) === '.png' ? {
        oxipng: {
          level: 6,
        },
      } : {
        mozjpeg: {
          quality: 80,
        },
      }),
    },
  })))
  .pipe(dest(PATHS.build.images));

// Compressing vector image *.svg files
export const optimizeSvg = () => src([
  `${PATHS.src.images}/**/*.svg`,
  `!${PATHS.src.icons}/**`,
])
  .pipe(svgmin({
    multipass: true,
  }))
  .pipe(dest(PATHS.build.images));

// Copying image files
export const copyImages = () => src([
  `${PATHS.src.images}/**/*.{png,jpg,svg}`,
  `!${PATHS.src.icons}/**`,
])
  .pipe(dest(PATHS.build.images));

// Fast generation of image files in *.webp format
export const fastWebp = () => src([
  `${PATHS.src.images}/**/*.{png,jpg}`,
  `!${PATHS.src.favicons}/**`,
])
  .pipe(squoosh({
    encodeOptions: {
      webp: {
        method: 0,
      },
    },
  }))
  .pipe(dest(PATHS.build.images));

// Creating SVG-sprite
export const sprite = () => src(`${PATHS.src.icons}/*.svg`)
  .pipe(svgmin((file) => {
    const prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      multipass: true,
      plugins: [
        {
          name: 'cleanupIDs',
          params: {
            prefix: `${prefix}-`,
            minify: true,
          },
        },
        {
          name: 'removeViewBox',
          active: false,
        },
      ],
    };
  }))
  .pipe(svgstore({
    inlineSvg: true,
  }))
  .pipe(rename('sprite.svg'))
  .pipe(dest(PATHS.build.images));

// Deleting files in the build directory before copying
export const clean = () => deleteAsync(PATHS.build.root);

// Copying files to the build directory
export const copy = (done) => {
  src([
    `${PATHS.src.fonts}/**/*.{woff,woff2}`,
    `${PATHS.src.root}/*.ico`,
    `${PATHS.src.root}/*.webmanifest`,
  ], {
    base: PATHS.src.root,
  })
    .pipe(dest(PATHS.build.root));
  done();
};

// Refreshing page
export const refresh = (done) => {
  browserSync.reload();
  done();
};

// Start Browsersync server
export const server = (done) => {
  browserSync.init({
    ui: false,
    server: PATHS.build.root,
    cors: true,
    notify: false,
  });
  done();
};

// Watching changes in project files
export const watcher = () => {
  watch(`${PATHS.src.styles}/**/*.scss`, styles);
  watch(`${PATHS.src.js}/**/*.js`, scripts);
  watch(`${PATHS.src.root}/**/*.pug`, series(html, refresh));
};

// Build the project for production
export const build = series(
  clean,
  parallel(
    copy,
    styles,
    html,
    scripts,
    optimizeImages,
    optimizeSvg,
    sprite,
  ),
);

// Build the project and start Browsersync server
export const dev = series(
  clean,
  parallel(
    copy,
    styles,
    html,
    scripts,
    optimizeSvg,
    copyImages,
    fastWebp,
    sprite,
  ),
  server,
  watcher,
);

export default dev;
