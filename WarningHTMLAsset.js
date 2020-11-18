"use strict";

const debug = require("debug")("parcel-plugin-warning");
const fs = require("fs");
const HTMLAsset = require("parcel-bundler/lib/assets/HTMLAsset");
const logger = require("@parcel/logger");
const path = require("path");
const resolveUrlToFilePath = require('./utils/resolveUrlToFilePath');
const urlJoin = require('parcel-bundler/lib/utils/urlJoin');

/**
 * PLEASE BE AWARE:
 * This is a fairly fragile patch and if not maintained could very easily
 * break dependency resolution for HTMLAssets.
 */
class WarningHTMLAsset extends HTMLAsset {
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
    const filePath = resolveUrlToFilePath(p);

    if (this.options.prototyper) {
        const staticPath = path.resolve(this.options.prototyper.dirs.static, filePath);
        const exists = fs.existsSync(staticPath);

        if (exists) {
            shouldAdd = false;
        }
    }

    debug(shouldAdd)

    if (shouldAdd) {
        return super.processSingleDependency(p, opts);
    }

    return urlJoin(this.options.publicURL, p);
  }
}

module.exports = WarningHTMLAsset;
