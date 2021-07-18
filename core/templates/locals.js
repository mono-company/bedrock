const path = require('path');
const fs = require('fs');
const pug = require('pug');
const moment = require('moment');
const marked = require('marked');
const htmlToJSX = require('html-to-jsx');

const config = require('../discovery/config');
const paths = require('../paths');
const beautifyHTML = require('js-beautify').html;

const MultipleBaseDirs = require('../templates/multi-basedirs');

function indentCode(code) { return code.split('\n').map(line => `    ${line}`).join('\n'); }


function getDefaultLocals() {
  delete require.cache[require.resolve('../discovery/pages')];
  delete require.cache[require.resolve('../discovery/colors')];
  delete require.cache[require.resolve('../discovery/icons')];
  delete require.cache[require.resolve('../discovery/components')];
  delete require.cache[require.resolve('../discovery/content-data')];

  const pages = require('../discovery/pages');
  const colors = require('../discovery/colors');
  const icons = require('../discovery/icons');
  const components = require('../discovery/components');
  const contentData = require('../discovery/content-data');

  const locals = {
    basedir: './content/',
    plugins: [MultipleBaseDirs()],
    contentData: contentData.discover(),
    components: components.discover(),
    pages: pages.discover(),
    icons: icons.discover(),
    config,
    colorCategories: colors.discover(),
    moment: moment,
    marked: marked
  };

  locals.renderSvgIcon = function (name) {
    const svgFileLocation = path.join(paths.content.icons.sourceDirectory, name + '.svg');
    return fs.readFileSync(svgFileLocation, 'utf8');
  };

  locals.renderCode = function (id, language) {

    const componentFileLocation = path.join(paths.content.templates.components, id + '.pug');
    const pugMarkup = fs.readFileSync(componentFileLocation, 'utf8');

    if (!language || language === 'pug') {
      return pugMarkup;
    } else if (language === 'html') {

      const indentedPugMarkup = indentCode(pugMarkup);
      const markupWithLayout = `extends /core/templates/layouts/sample\n\nblock content\n${indentedPugMarkup}`;

      // First compile Pug
      var a = pug.compile(markupWithLayout, {
        pretty: true,
        basedir: 'content',
        filename: componentFileLocation,
        plugins: [MultipleBaseDirs()]
      })(locals);

      // Then beautify with JS beautify settings
      var b = beautifyHTML(a, config.prettify);
      return b;

    } else if (language == "jsx") {

      // I know we are repeating 8 lines of code from above, could be made more DRY

      const indentedPugMarkup = pugMarkup.split('\n').map(line => `    ${line}`).join('\n');
      const markupWithLayout = `extends /core/templates/layouts/sample\n\nblock content\n${indentedPugMarkup}`;

      // First compile Pug
      var compiledPug = pug.compile(markupWithLayout, {
        pretty: true,
        basedir: 'content',
        filename: componentFileLocation,
        plugins: [MultipleBaseDirs()]
      })(locals);

      const reactFunctionBegin = `{/* Note that this is merely a starting point for a real React component */}
export default function Example() {
  return (`

      const reactFunctionEnd = `
  )
}`

      let reactCodeExample = reactFunctionBegin + indentCode(htmlToJSX(compiledPug)) + reactFunctionEnd;
      return reactCodeExample;

    }
  };

  return locals;
}

module.exports = {
  getDefaultLocals
};
