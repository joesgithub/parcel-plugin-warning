'use strict';

const config = require('parcel-bundler/lib/utils/config');
const debug = require('debug')('parcel-plugin-ssg:HTMLAsset');
const FrontMatterAsset = require('./FrontMatterAsset');
const localRequire = require('parcel-bundler/lib/utils/localRequire');

class HTMLAsset extends FrontMatterAsset {
    constructor(name, options) {
        super(name, options);
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
            this.addDependency(conf, { includedInParent: true });
            if (opts.load === false) {
                return conf;
            }

            // Begin patch
            let cfg = await config.load(opts.path || this.name, filenames);

            if (typeof cfg === "function") {
                cfg = cfg({ locals: this.templateVars });
            }

            return cfg;
        } else if (filenames.indexOf('.posthtmlrc') > -1) {
            const postHtmlExpressions = await localRequire('posthtml-expressions', this.name);

            return {
                plugins: [
                    postHtmlExpressions({ locals: this.templateVars })
                ]
            }
        }
        // End patch

        return null;
    }
}

module.exports = HTMLAsset