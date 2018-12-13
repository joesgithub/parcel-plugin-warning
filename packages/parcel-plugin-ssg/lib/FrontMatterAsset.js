'use strict';

const config = require('parcel-bundler/src/utils/config');
const DataFiles = require('./DataFiles');
const debug = require('debug')('parcel-plugin-ssg:FrontMatterAsset');
const FourOhFourAsset = require('parcel-plugin-asset-404handler/lib/404Asset');
const matter = require('gray-matter');
const path = require('path');
const _ = require('lodash');

/**
 * Extends HTMLAsset to add front matter support to the built-in HTMLAsset
 */
class FrontMatterAsset extends FourOhFourAsset {
    constructor(name, options) {
        super(name, options)
    }

    async load() {
      // Load global data into class scope
      this.globals = await this.loadGlobals(this.options.rootDir);

      // Parse front matter and return content
      return await this.parseFrontMatter(await super.load())
    }

    /**
     * Parses front matter from content string
     * 
     * @param {String} content 
     */
    async parseFrontMatter(content) {
      const parsed = matter(content);
      this.frontMatter = parsed.data;
      this.rawContent = parsed.content;

      return parsed.content;
    }

    /**
     * Override the default behaviour to inject data into posthtml
     * Need to ensure this always stays up-to-date with parcel's built-in asset class
     * 
     * @param {[String]} filenames 
     * @param {Object} opts 
     */
    async getConfig(filenames, opts = {}) {
        if (opts.packageKey) {
          let pkg = await this.getPackage();
          if (pkg && pkg[opts.packageKey]) {
            return clone(pkg[opts.packageKey]);
          }
        }
    
        // Resolve the config file
        let conf = await config.resolve(opts.path || this.name, filenames);
        if (conf) {
          // Add as a dependency so it is added to the watcher and invalidates
          // this asset when the config changes.
          this.addDependency(conf, {includedInParent: true});
          if (opts.load === false) {
            return conf;
          }
    
          let cfg = await config.load(opts.path || this.name, filenames);

          if (typeof cfg === "function") {
              cfg = cfg({frontmatter: this.frontMatter, globals: this.globals});
          }

          return cfg;
        }
    
        return null;
      }

      async loadGlobals(dir) {
        const globals = this.globals || {};
        const dataFiles = new DataFiles(dir);
        const files = await dataFiles.getFilePaths();

        if (files.length > 0) {
          for (var i in files) {
            const file = files[i];
            const name = path.basename(file, path.extname(file));
            const key = name.replace(this.options.rootDir, "").replace("/", ".");
            const data = await dataFiles.getData(file);
            
            // Add as a dependency so it is added to the watcher and invalidates
            // this asset when the config changes.
            this.addDependency(file, {includedInParent: true});

            _.set(globals, key, data);
          }
        }

        debug(globals);

        return globals;
      }
}

module.exports = FrontMatterAsset;