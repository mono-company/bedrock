'use strict';

const frontMatter = require('front-matter');
const marked = require('marked');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const pug = require('pug');
const beautify = require('js-beautify').html;

const config = require('./config');
const locals = require('../templates/locals');
const paths = require('../paths');

const MultipleBaseDirs = require('../templates/multi-basedirs');

module.exports = {
  discover: function () {
    const docFiles = glob.sync(paths.content.docs)
      .filter(g => path.parse(g).ext === '.pug' || path.parse(g).ext === '.md')
      .map(function (docPath) {
        const parsedPath = path.parse(docPath);
        const fileContent = fs.readFileSync(docPath, 'utf8');
        const parsedFile = frontMatter(fileContent);
        const filename = parsedPath.name;
        const extension = parsedPath.ext;

        parsedFile.attributes.filename = filename;

        if (extension === '.md') {
          parsedFile.body = marked(parsedFile.body);
        } else if (extension === '.pug') {
          const indentedPugMarkup = parsedFile.body.split('\n').map(line => `    ${line}`).join('\n');
          const markupWithLayout = `extends /../core/templates/layouts/sample\n\nblock content\n${indentedPugMarkup}`;

          const compiler = pug.compile(markupWithLayout, Object.assign({}, config.pug, {
            filename: docPath,
            plugins: [MultipleBaseDirs()]
          }));
          parsedFile.body = compiler(Object.assign({}, locals.getDefaultLocals(), {
            pathname: `styleguide/docs/${filename}`
          }));
        }

        if (!parsedFile.attributes.title) {
          parsedFile.attributes.title = filename.replace(/-/g, ' ');
        }

        return parsedFile;
      });

    return {
      allDocs: docFiles,
      byCategory: _.chain(docFiles)
        .groupBy((d) => d.attributes.category)
        .mapValues((docsInCategory) => {
          return _.sortBy(docsInCategory, (d) => d.attributes.order)
        })
        .value()
    };
  }
};
