'use strict';

const debug = require('debug')('parcel-plugin-ssg:NunjucksAsset');
const FrontMatterAsset = require('./FrontMatterAsset');
const localRequire = require('parcel-bundler/lib/utils/localRequire');
const path = require('path');

/**
 * Class extends HTMLAsset to add Nunjucks support
 */
class NunjucksAsset extends FrontMatterAsset {
  constructor(name, options) {
    super(name, options);

    this.ext = path.extname(this.name);
    this.engine = 'nunjucks';
    this.engineModule = 'nunjucks';
  }

  /**
   * Hijack pretransform to process template before collecting dependencies
   */
  async pretransform(precompile = false) {
    try {
        if (!precompile) {
            let output;

            // Automatically install engine module if it's not found. We need 
            // to do this before requiring consolidate so that it's available.
            const Nunjucks = await localRequire(this.engineModule, this.name);
            const env = new Nunjucks.Environment(
                new Nunjucks.FileSystemLoader(this.options.rootDir)
            );

            debug(this.contents);

            output = env.renderString(this.contents, Object.assign({}, this.frontMatter, {globals: this.globals}));

            debug(output);

            this.contents = output;
        }

        await super.pretransform();
    } catch (error) {
        throw error
    }
  }

  resolvePartials(engine) {
      // TODO:
  }
}

module.exports = NunjucksAsset;