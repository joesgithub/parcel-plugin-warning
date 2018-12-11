'use strict';

const debug = require('debug')('parcel-plugin-ssg:ConsolidateAsset')
const extMap = require('./utils/extMap');
const FrontMatterAsset = require('./FrontMatterAsset');
const localRequire = require('parcel-bundler/src/utils/localRequire');
const moduleMap = require('./utils/moduleMap');
const path = require('path');

/**
 * Class extends HTMLAsset to add consolidate support to the standard
 * HTMLAsset pipeline
 */
class ConsolidateAsset extends FrontMatterAsset {
  constructor(name, options) {
    super(name, options);

    this.ext = path.extname(this.name);
    this.engine = this.resolveEngine(this.ext);
    this.engineModule = this.resolveEngineModule(this.engine);
  }

  /**
   * Hijack the load command to read and parse file
   * with Nunjucks instead of fs.readFileSync
   */
  async load() {
    let output
    const options = {};
    
    // Catch errors
    try {
        // Load front matter for usage in consolidate
        await super.load();
        
        // Automatically install engine module if it's not found. We need 
        // to do this before requiring consolidate so that it's available.
        const engineOptions = {};
        const engineModule = await localRequire(this.engineModule, this.name);
        const consolidate = require('consolidate');

        // Configure engine options
        switch (this.engine) {
            case "nunjucks":
                consolidate.requires[this.engine] = engineModule.configure();
                break;
            default:
                consolidate.requires[this.engine] = engineModule;
                break;
        }

        output = await consolidate[this.engine](this.name, Object.assign(options, this.frontMatter, {globals: this.globals}));
    } catch (error) {
      throw new Error(error);
    }

    return await this.parseFrontMatter(output);
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

module.exports = ConsolidateAsset;