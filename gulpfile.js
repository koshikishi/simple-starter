import {rmSync} from 'node:fs';
import path from 'node:path';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import * as dartSass from 'sass';
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
import webpackConfig from './webpack.config.js';
import sharp from 'gulp-sharp-optimize-images';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import {create as bsCreate} from 'browser-sync';

const {src, dest, watch, series, parallel} = gulp;
const browserSync = bsCreate();

// Paths to files
const Path = {
  Source: {
    ROOT: 'source',
    STYLES: 'source/styles',
    SCRIPTS: 'source/js',
    IMAGES: 'source/images',
    ICONS: 'source/images/icons',
    FAVICONS: 'source/images/favicons',
    FONTS: 'source/fonts',
  },
  Build: {
    ROOT: 'build',
    STYLES: 'build/css',
    SCRIPTS: 'build/js',
    IMAGES: 'build/images',
  },
};

// Compiles *.css files from *.scss with autoprefixer and minification
const sass = gulpSass(dartSass);

export const styles = () => src(`${Path.Source.STYLES}/style.scss`)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    postcssNormalize(),
    postcssPresetEnv({
      features: {
        'overflow-wrap-property': {
          method: 'copy',
        },
      },
    }),
    autoprefixer(),
    cssnano(),
  ]))
  .pipe(rename({
    suffix: '.min',
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(dest(Path.Build.STYLES))
  .pipe(browserSync.stream());

// Compiles *.html files from *.pug with minification
export const html = () => src(`${Path.Source.ROOT}/*.pug`)
  .pipe(pug())
  .pipe(htmlmin({
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
  }))
  .pipe(dest(Path.Build.ROOT));

// Transpiles and minifies *.js script files
export const scripts = () => src(`${Path.Source.SCRIPTS}/main.js`)
  .pipe(webpack(webpackConfig))
  .pipe(dest(Path.Build.SCRIPTS));

// Optimizes raster image files with generation of *.webp and/or *.avif format
export const optimizeImages = () => src([
  `${Path.Source.IMAGES}/**/*.{png,jpg}`,
  `!${Path.Source.FAVICONS}/**`,
])
  .pipe(sharp({
    webp: {
      quality: 80,
    },
    // Uncomment below to enable *.avif images generation
    // avif: {
    //   quality: 65,
    // },
  }))
  .pipe(dest(Path.Build.IMAGES))
  .pipe(src(`${Path.Source.IMAGES}/**/*.{png,jpg}`))
  .pipe(sharp({
    png_to_png: {
      compressionLevel: 9,
      adaptiveFiltering: true,
    },
    jpg_to_jpg: {
      quality: 80,
      progressive: true,
      mozjpeg: true,
    },
  }))
  .pipe(dest(Path.Build.IMAGES));

// Optimizes vector image *.svg files
export const optimizeSvg = () => src([
  `${Path.Source.IMAGES}/**/*.svg`,
  `!${Path.Source.ICONS}/**`,
])
  .pipe(svgmin({
    multipass: true,
  }))
  .pipe(dest(Path.Build.IMAGES));

// Copies image files
export const copyImages = () => src([
  `${Path.Source.IMAGES}/**/*.{png,jpg,svg}`,
  `!${Path.Source.ICONS}/**`,
])
  .pipe(dest(Path.Build.IMAGES));

// Quickly generates of image files in *.webp and/or *.avif format
export const fastImages = () => src([
  `${Path.Source.IMAGES}/**/*.{png,jpg}`,
  `!${Path.Source.FAVICONS}/**`,
])
  .pipe(sharp({
    webp: {
      effort: 0,
    },
    // Uncomment below to enable *.avif images generation
    // avif: {
    //   effort: 0,
    // },
  }))
  .pipe(dest(Path.Build.IMAGES));

// Creates SVG-sprite
export const sprite = () => src(`${Path.Source.ICONS}/*.svg`)
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
  .pipe(dest(Path.Build.IMAGES));

// Deletes files in the build directory before copying
export const clean = (done) => {
  rmSync(Path.Build.ROOT, {
    force: true,
    recursive: true,
  });
  done();
};

// Copies files to the build directory
export const copy = (done) => {
  src([
    `${Path.Source.FONTS}/**/*.{woff,woff2}`,
    `${Path.Source.ROOT}/*.ico`,
    `${Path.Source.ROOT}/*.webmanifest`,
  ], {
    base: Path.Source.ROOT,
  })
    .pipe(dest(Path.Build.ROOT));
  done();
};

// Refreshes page
export const refresh = (done) => {
  browserSync.reload();
  done();
};

// Starts Browsersync server
export const server = (done) => {
  browserSync.init({
    ui: false,
    server: Path.Build.ROOT,
    cors: true,
    notify: false,
  });
  done();
};

// Watches changes in project files
export const watcher = () => {
  watch(`${Path.Source.STYLES}/**/*.scss`, styles);
  watch(`${Path.Source.SCRIPTS}/**/*.js`, scripts);
  watch(`${Path.Source.ROOT}/**/*.pug`, series(html, refresh));
};

// Builds the project for production
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

// Builds the project and start Browsersync server
export const dev = series(
  clean,
  parallel(
    copy,
    styles,
    html,
    scripts,
    optimizeSvg,
    copyImages,
    fastImages,
    sprite,
  ),
  server,
  watcher,
);

export default dev;
