"use strict";

const debug = require('debug')('parcel-plugin-asset-404handler');
const fs = require('fs');
const HTMLAsset = require('parcel-bundler/lib/assets/HTMLAsset');
const logger = require('parcel-bundler/lib/Logger');

/**
 * PLEASE BE AWARE:
 * This is a fairly fragile patch and if not maintained could very easily
 * break dependency resolution for HTMLAssets.
 */
class FourOhFourAsset extends HTMLAsset {
    addDependency(name, opts) {
        let exists

        if (opts.resolved) {
            exists = fs.existsSync(opts.resolved);
        }

        if (exists || !opts.resolved) {
            this.dependencies.set(name, Object.assign({name}, opts));
        } else {
            logger.warn(`Dependency ${name} not resolved in ${this.name}`);
        }
      }
}

module.exports = FourOhFourAsset;