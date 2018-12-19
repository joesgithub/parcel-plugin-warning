"use strict";

const debug = require("debug")("parcel-plugin-asset-fourohfour");
const fs = require("fs");
const HTMLAsset = require("parcel-bundler/lib/assets/HTMLAsset");
const logger = require("parcel-bundler/lib/Logger");
const path = require("path");

/**
 * PLEASE BE AWARE:
 * This is a fairly fragile patch and if not maintained could very easily
 * break dependency resolution for HTMLAssets.
 */
class FourOhFourAsset extends HTMLAsset {
  addDependency(name, opts) {
    let exists;
    let isStatic = false;

    if (opts.resolved) {
      exists = fs.existsSync(opts.resolved);
    }

    if (!exists && opts.resolved && this.options.prototyper) {
      const relPath = path.relative(this.options.rootDir, opts.resolved);
      const staticPath = path.resolve(
        this.options.prototyper.dirs.static,
        relPath
      );

      debug(relPath, staticPath);

      isStatic = fs.existsSync(staticPath);
    }

    if (exists || !opts.resolved) {
      super.addDependency(name, opts);
    } else if (isStatic === false) {
      logger.warn(`Dependency ${name} not resolved in ${this.name}`);
    }
  }

  /**
   * Doesn't re-write URL deps that exist in static files
   * 
   * @param {String} p Path of dependency 
   * @param {*} opts 
   */
  processSingleDependency(p, opts) {
    let shouldAdd = true;

    if (this.options.prototyper) {
        const staticPath = path.resolve(this.options.prototyper.dirs.static, p);
        const exists = fs.existsSync(staticPath);

        if (exists) {
            shouldAdd = false;
        }
    }

    if (shouldAdd) {
        return super.processSingleDependency(p, opts);
    }

    return p;
  }
}

module.exports = FourOhFourAsset;
