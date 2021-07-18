/*
 * This is a Pug plugin to allow multiple basedirs. This is used to have Pug
 * templates in both Bedrock core and in a project that uses Bedrock.
 *
 * From https://github.com/pugjs/pug/issues/2499 and
 * https://github.com/gryphonmyers/pug-multiple-basedirs-plugin
 */

const { accessSync, constants: {R_OK} } = require('fs');
const path = require('path');

const config = require('../discovery/config');

// The multiple basedirs are the user-defined basedir plus Bedrock's. Adding
// bedrockDir allows to refer to Bedrock's core templates with the /core
// prefix. Adding it at the end allows users to override core templates.
const bedrockDir = path.join(__dirname, '../../');
const basedirs = [config.pug.basedir, bedrockDir];

const exists = filename => {
  try {
    accessSync(filename, R_OK);
    return true;
  } catch (err) {
    return false;
  }
};

function MultipleBaseDirs() {
  return {
    name: 'multipleBasedirs',
    resolve(filename, source) {
      let out;

      if (filename[0] === '/') {
        filename = filename.substr(1);
        if (!basedirs.some(basedir => exists(out = path.resolve(basedir, filename)))) {
          throw new Error(`${filename} cannot be found in any basedir`);
        }
      } else {
        if (!source) {
          throw new Error('the "filename" option is required to use includes and extends with "relative" paths');
        }

        out = path.resolve(path.dirname(source), filename);
      }

      return out;
    }
  };
}

module.exports = MultipleBaseDirs;
