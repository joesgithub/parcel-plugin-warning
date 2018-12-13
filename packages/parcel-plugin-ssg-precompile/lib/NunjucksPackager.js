'use strict';

const debug = require('debug')('parcel-plugin-njk-precompile')
const Packager = require('parcel-bundler/src/packagers/Packager');
const Nunjucks = require('nunjucks');
const path = require('path');

/**
 * Class extands JSAsset to add Nunjucks pre-compile support
 */
class NunjucksPackager extends Packager {
  async start() {
      this.addedAssets = new Set();
      this.assets = new Map();
      this.size = 0;

      for (let asset of this.bundle.assets) {
        
      }
  }
}

module.exports = NunjucksPackager;