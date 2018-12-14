'use strict';

const config = require('parcel-bundler/lib/utils/config');
const debug = require('debug')('parcel-plugin-ssg:HTMLAsset');
const FrontMatterAsset = require('./FrontMatterAsset');

class HTMLAsset extends FrontMatterAsset {
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
            this.addDependency(conf, { includedInParent: true });
            if (opts.load === false) {
                return conf;
            }

            // Begin patch
            let cfg = await config.load(opts.path || this.name, filenames);

            if (typeof cfg === "function") {
                cfg = cfg({ locals: this.templateVars });
            }
            // End patch

            return cfg;
        }

        return null;
    }
}

module.exports = HTMLAsset