'use strict';

const path = require('path');

const config = require('./discovery/config');

const contentPath = 'content/';
const corePath = 'core/';
const compiledPath = 'tmp/';
const distPath = 'dist/';

module.exports = {
  content: {
    path: contentPath,
    docs: path.join(contentPath, 'docs/**/*'),
    assets: {
      images: path.join(contentPath, 'images/**/*'),
      fonts: path.join(contentPath, 'fonts/**/*'),
      resources: path.join(contentPath, 'resources/**/*'),
      favicon: path.join(contentPath, 'favicon*')
    },
    postcss: {
      all: path.join(contentPath, 'postcss/**/*.css'),
      allMainFiles: path.join(contentPath, 'postcss/*.css'),
    },
    scss: {
      all: path.join(contentPath, 'scss/**/*.scss'),
      main: path.join(contentPath, 'scss/main.scss'),
      allMainFiles: path.join(contentPath, 'scss/*.scss'),
      base: path.join(contentPath, 'scss/base/'),
      custom: path.join(contentPath, 'scss/custom/'),
      settings: path.join(contentPath, 'scss/settings/'),
      colorsDefinition: config.styleguide ? config.styleguide.colors : null,
    },
    templates: {
      path: path.join(contentPath, 'templates/'),
      modulesPath: path.join(contentPath, 'templates/modules/'),
      all: path.join(contentPath, 'templates/**/*.pug'),
      baseTemplates: path.join(contentPath, 'templates/*.pug'),
      moduleTemplates: path.join(contentPath, 'templates/modules/**/*.pug'),
      patterns: path.join(contentPath, 'templates/_patterns/'),
      components: path.join(contentPath, 'templates/_components/'),
      allComponents: path.join(contentPath, 'templates/_components/**/*.pug'),
      data: path.join(contentPath, 'data/*')
    },
    js: {
      entryFile: path.join(contentPath, 'js/index.js'),
      allFiles: path.join(contentPath, 'js/**/*.js'),
      separated: path.join(contentPath, 'js/*.js')
    },
    icons: {
      sourceDirectory: path.join(contentPath, 'icons'),
      sourceFiles: path.join(contentPath, 'icons', '**/*.svg')
    },
    iconFont: {
      sourceDirectory: path.join(contentPath, 'icon-font-source/'),
      sourceFiles: path.join(contentPath, 'icon-font-source/*svg')
    },
  },
  core: {
    path: corePath,
    js: {
      entryFile: path.join(corePath, 'js/index.js'),
      allFiles: path.join(corePath, 'js/**/*.js')
    },
    scss: {
      all: path.join(corePath, 'scss/**/*.scss'),
      prototype: path.join(corePath, 'scss/prototype.scss')
    },
    templates: {
      styleguide: {
        index: path.join(corePath, 'templates/styleguide/index.pug'),
        doc: path.join(corePath, 'templates/styleguide/doc.pug'),
        colors: path.join(corePath, 'templates/styleguide/colors.pug'),
        componentGroup: path.join(corePath, 'templates/styleguide/component-group.pug')
      }
    }
  },
  compiled: {
    path: compiledPath,
    fonts: path.join(compiledPath, 'fonts/'),
    modules: path.join(compiledPath, 'modules/'),
    js: path.join(compiledPath, 'js/'),
    css: path.join(compiledPath, 'css/'),
    styleguide: path.join(compiledPath, 'styleguide/'),
    docs: path.join(compiledPath, 'styleguide/docs/'),
    assets: {
      images: path.join(compiledPath, 'images/'),
      fonts: path.join(compiledPath, 'fonts/'),
      resources: path.join(compiledPath, 'resources/')
    }
  },
  dist: {
    path: distPath,
    fonts: path.join(distPath, 'fonts/'),
    modules: path.join(distPath, 'modules/'),
    js: path.join(distPath, 'js/'),
    css: {
      mainPath: path.join(distPath, 'css/'),
      allFiles: path.join(distPath, 'css/**/*.css'),
    },
    partials: path.join(distPath, 'partials/'),
    styleguide: path.join(distPath, 'styleguide/'),
    docs: path.join(distPath, 'styleguide/docs/'),
    assets: {
      images: path.join(distPath, 'images/'),
      fonts: path.join(distPath, 'fonts/'),
      resources: path.join(distPath, 'resources/')
    }
  }
};
