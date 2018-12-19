'use strict';

const DataFiles = require('./DataFiles');
const debug = require('debug')('parcel-plugin-ssg:FrontMatterAsset');
const FourOhFourAsset = require('parcel-plugin-asset-fourohfour/lib/HTML404Asset');
const matter = require('gray-matter');
const path = require('path');
const _ = require('lodash');

/**
 * Extends HTMLAsset to add front matter support to the built-in HTMLAsset
 */
class FrontMatterAsset extends FourOhFourAsset {
  async load() {
    try {
      const dataDir = this.options.prototyper ? this.options.prototyper.dirs.data : this.options.rootDir;
      const content = await super.load();
      this.globals = await this.loadGlobals(dataDir);
      this.rawContents = await this.parseFrontMatter(content);

      return this.rawContents;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds a json output for the front matter and global data
   * @param {*} content 
   */
  async postProcess(generated) {
    const mainAssets = await super.postProcess(generated);
    const dataAsset = {
      type: 'json',
      value: JSON.stringify(this.templateVars, null, 2)
    }
    const allAssets = mainAssets.concat([dataAsset]);

    return allAssets
  }

  /**
   * Parses front matter from content string
   * 
   * @param {String} content 
   */
  async parseFrontMatter(content) {
    try {
      const parsed = matter(content);
      const combinedData = parsed.data || {};
      combinedData.globals = this.globals;

      this.frontMatter = parsed.data;
      this.templateVars = combinedData;

      return parsed.content;
    } catch (error) {
      throw error
    }
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
        this.addDependency(file, { includedInParent: true });

        _.set(globals, key, data);
      }
    }

    debug(globals);

    return globals;
  }
}

module.exports = FrontMatterAsset;