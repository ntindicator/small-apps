'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const bs = require('browser-sync').create();
const fs = require('fs');
const path = require('path');


const sapath = {
  src: {
    html: 'source/*.html',
    others: 'source/*.+(php|ico|png)',
    htminc: 'source/partials/**/*.htm',
    incdir: 'source/partials/',
    plugins: 'source/plugins/**/*.*',
    js: 'source/js/*.js',
    scss: 'source/scss/**/*.scss',
    images: 'source/images/**/*.+(png|jpg|gif|svg)'
  },
  build: {
    dirDev: 'theme/'
  }
};

// Clean Build Folder
function clean(cb) {
  const dir = path.resolve('./theme');
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  cb();
}


// HTML
function html() {
  return gulp.src(sapath.src.html)
    .pipe(fileinclude({ basepath: sapath.src.incdir }))
    .pipe(gulp.dest(sapath.build.dirDev))
    .pipe(bs.stream());
}

// SCSS
function scss() {
  return gulp.src(sapath.src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(sapath.build.dirDev + 'css/'))
    .pipe(bs.stream());
}

// Javascript
function js() {
  return gulp.src(sapath.src.js)
    .pipe(gulp.dest(sapath.build.dirDev + 'js/'))
    .pipe(bs.stream());
}

// Images
function images() {
  return gulp.src(sapath.src.images)
    .pipe(gulp.dest(sapath.build.dirDev + 'images/'))
    .pipe(bs.stream());
}

// Plugins
function plugins() {
  return gulp.src(sapath.src.plugins)
    .pipe(gulp.dest(sapath.build.dirDev + 'plugins/'))
    .pipe(bs.stream());
}

// Other files like favicon, php, sourcele-icon on root directory
function others() {
  return gulp.src(sapath.src.others)
    .pipe(gulp.dest(sapath.build.dirDev));
}

// Watch Task
function watchFiles() {
  gulp.watch(sapath.src.html, html);
  gulp.watch(sapath.src.htminc, html);
  gulp.watch(sapath.src.scss, scss);
  gulp.watch(sapath.src.js, js);
  gulp.watch(sapath.src.images, images);
  gulp.watch(sapath.src.plugins, plugins);
}

// Build Task
const build = gulp.series(
  clean,
  gulp.parallel(html, js, scss, images, plugins, others)
);

function serve() {
  bs.init({ server: { baseDir: sapath.build.dirDev } });
  watchFiles();
}

exports.clean = clean;
exports.html = html;
exports.scss = scss;
exports.js = js;
exports.images = images;
exports.plugins = plugins;
exports.others = others;
exports.watch = watchFiles;
exports.build = build;
exports.serve = gulp.series(build, serve);
exports.default = exports.serve;
