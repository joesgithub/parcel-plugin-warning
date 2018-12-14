'use strict';

const debug = require('debug')('parcel-plugin-ssg:NunjucksAsset');
const extMap = require('./utils/extMap');
const FrontMatterAsset = require('./FrontMatterAsset');
const localRequire = require('parcel-bundler/lib/utils/localRequire');
const moduleMap = require('./utils/moduleMap');
const path = require('path');

/**
 * Class extends HTMLAsset to add Nunjucks support
 */
class NunjucksAsset extends FrontMatterAsset {
  constructor(name, options) {
    super(name, options);

    this.ext = path.extname(this.name);
    this.engine = this.resolveEngine(this.ext);
    this.engineModule = this.resolveEngineModule(this.engine);
  }

  /**
     * Runs final output through Nunjucks
     * 
     * @param {String} generated 
     */
    async postProcess(generated) {
        try {
            let output;
            const result = await super.postProcess(generated);
            const contents = result[0].value;
            const engineOptions = {};
           
            // Make unprocessed template available to other plugins
            this.rawGenerated = contents;

            // Automatically install engine module if it's not found. We need 
            // to do this before requiring consolidate so that it's available.
            const Nunjucks = await localRequire(this.engineModule, this.name);

            output = Nunjucks.renderString(contents, Object.assign({}, this.frontMatter, {globals: this.globals}));

            result[0].value = output;

            return result;
        } catch (error) {
            throw error
        }
      }

  resolveEngine(ext) {
    let engine;

    for (var key in extMap) {
        const match = extMap[key].indexOf(`${ext}`) > -1;

        if (match) {
            engine = key;
            break
        }
    }

    if (engine) {
        return engine
    } else {
        throw new Error(`No engine found for ${this.name}`);
    }
  }

  resolveEngineModule(engine) {
    const match = Object.keys(moduleMap).indexOf(engine);

    if (match) {
        return moduleMap[engine];
    } else {
        throw new Error(`No engineModule found for ${engine}`);
    }
  }

  resolvePartials(engine) {
      const exts = extMap[engine];
      // TODO:
  }
}

module.exports = NunjucksAsset;