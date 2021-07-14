'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');

const browserSync = require('./core/tasks/browser-sync');
const bundle = require('./core/tasks/bundle');
const templates = require('./core/tasks/templates');
const copy = require('./core/tasks/copy');
const watch = require('./core/tasks/watch');
const server = require('./core/tasks/server');
const iconFont = require('./core/tasks/icon-font');

// Configs
const config = require('./core/discovery/config');

// Sass is used to render core templates so is needed, even if you use postcss in your content part
const sass = require('./core/tasks/sass');
const postcss = require('./core/tasks/postcss');

// Optional tasks: Purge CSS and minify CSS
const purge = require('./core/tasks/purge');
const minifyCSS = require('./core/tasks/minify-css');

// Execute this task instead of optional tasks
const dummy = require('./core/tasks/dummy');

gulp.task('templates:clean', templates.clean);
gulp.task('sass', sass);
gulp.task('postcss', postcss);
gulp.task('minifyCSS', minifyCSS);
gulp.task('purgeCSS', purge);
gulp.task('server', server);
gulp.task('dummy', dummy);
gulp.task('copy:images', copy.images);
gulp.task('copy:fonts', copy.fonts);
gulp.task('copy:favicon', copy.favicon);
gulp.task('copy:resources', copy.resources);
gulp.task('copy:scripts', copy.scripts);
gulp.task('copy:compiledToDist', copy.compiledToDist);
gulp.task('bundle:clientBundle', bundle.clientBundle);
gulp.task('bundle:prototypeBundle', bundle.prototypeBundle);
gulp.task('icon-font', iconFont);

gulp.task('templates:compile:content', templates.compile.content);
gulp.task('templates:compile:partials', templates.compile.partials);
gulp.task('templates:compile:styleguide', templates.compile.styleguide);
gulp.task('templates:compile:docs', templates.compile.docs);

var compileTasks = ['templates:compile:content'];
if (config.partials) {
  compileTasks.push('templates:compile:partials');
}
if (config.styleguide) {
  compileTasks.push('templates:compile:styleguide', 'templates:compile:docs');
}
gulp.task('templates:compile', gulp.parallel(...compileTasks));

gulp.task('watch', watch);
gulp.task('copy', gulp.parallel('copy:images', 'copy:fonts', 'copy:resources', 'copy:scripts', 'copy:favicon'));
gulp.task('compile-all', gulp.parallel('templates:clean', 'icon-font', 'bundle:clientBundle', 'bundle:prototypeBundle', 'sass', 'postcss', 'copy'));

gulp.task('build', gulp.series('compile-all', 'templates:compile', 'copy:compiledToDist', config.css.purge ? 'purgeCSS' : 'dummy', config.css.minify ? 'minifyCSS': 'dummy'), function (done) {
  console.log('------------\n');
  console.log('Build finished. Compiled files can be found in the dist/ directory.');
  process.exit(0);
});

gulp.task('default', gulp.parallel('server', 'compile-all', 'watch', browserSync));
