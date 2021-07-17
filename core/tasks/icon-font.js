const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const path = require('path');
const es = require('event-stream');
const exec = require('child_process').exec;
const browserSync = require('browser-sync');
const mkdirp = require('mkdirp');

const config = require('../discovery/config');
const paths = require('../paths');

const FONT_NAME = 'icon-font';
const TMP_DIRECTORY = './icon-font-tmp';

const iconFontClassPrefix = config.icons && config.iconFont.classPrefix || 'if';
const destFolder = path.dirname(config.iconFont.outputPath)
const fileName = path.basename(config.iconFont.outputPath, path.extname(config.iconFont.outputPath))

const cmd = `npx icon-font-generator ${paths.content.iconFont.sourceDirectory}/*.svg -n ${FONT_NAME} -o ${TMP_DIRECTORY} --html false -j false -p ${iconFontClassPrefix} --normalize --height 768 --descent 128 --types woff,woff2`;

module.exports = function (done) {

  if (!config.iconFont) {
    return done();
  }

  mkdirp.sync(TMP_DIRECTORY);

  exec(cmd, function (err, stdout, stderr) {
    if (stdout.includes('error')) {
      throw new Error(stdout);
    }

    const tasks = [
      gulp
        .src(path.join(TMP_DIRECTORY, FONT_NAME + '.css'))
        .pipe(rename(function (path) {
          path.basename = fileName;
          if (config.css.compiler == "scss") {
            path.extname = '.scss';
          }
          if (config.css.compiler == "postcss") {
            path.extname = '.css';
          }
        }))
        .pipe(replace('./', '/fonts/'))
        .pipe(gulp.dest(destFolder)),
      gulp.src([
          path.join(TMP_DIRECTORY, FONT_NAME + '.woff'),
          path.join(TMP_DIRECTORY, FONT_NAME + '.woff2')
        ])
        .pipe(gulp.dest(paths.compiled.fonts)),
    ];

    const taskStream = es.merge.apply(null, tasks);

    taskStream.on('end', function () {
      browserSync.reload();
      done();
    });
  });
};
