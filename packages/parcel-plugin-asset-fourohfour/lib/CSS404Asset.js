"use strict";

const debug = require('debug')('parcel-plugin-asset-fourohfour');
const fs = require('fs');
const CSSAsset = require('parcel-bundler/lib/assets/CSSAsset');
const logger = require('parcel-bundler/lib/Logger');

/**
 * PLEASE BE AWARE:
 * This is a fairly fragile patch and if not maintained could very easily
 * break dependency resolution for CSSAssets.
 */
class FourOhFourAsset extends CSSAsset {
  addDependency(name, opts) {
    let exists
    const hasExt = name.indexOf('.') > -1;

    if (opts && opts.resolved) {
      exists = fs.existsSync(opts.resolved);
    }

    if (exists || !hasExt) {
      this.dependencies.set(name, Object.assign({ name }, opts));
    } else {
      logger.warn(`Dependency ${name} not resolved in ${this.name}`);
    }
  }
}

module.exports = FourOhFourAsset;