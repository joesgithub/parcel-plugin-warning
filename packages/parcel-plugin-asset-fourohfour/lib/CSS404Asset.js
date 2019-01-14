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
class CssFourOhFourAsset extends CSSAsset {
  addDependency(name, opts) {
    let exists
    let isStatic = false;
    const hasExt = name.indexOf('.') > -1;

    if (opts && opts.resolved) {
      exists = fs.existsSync(opts.resolved);
    }

    if (!exists && opts && opts.resolved && this.options.prototyper) {
      const relPath = path.relative(this.options.rootDir, opts.resolved);
      const staticPath = path.resolve(
        this.options.prototyper.dirs.static,
        relPath
      );

      debug(relPath, staticPath);

      isStatic = fs.existsSync(staticPath);
    }

    if (exists || !hasExt || opts && !opts.resolved) {
      super.addDependency(name, opts);
    } else if (isStatic === false) {
      logger.warn(`Dependency ${name} not resolved in ${this.name}`);
    }
  }
}

module.exports = CssFourOhFourAsset;