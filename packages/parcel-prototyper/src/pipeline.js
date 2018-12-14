"use strict";

const Bundler = require('parcel-bundler');
const pluginAssetCsv = require('parcel-plugin-asset-csv');
const pluginSsg = require('parcel-plugin-ssg');
const pluginSsgPrecompile = require('parcel-plugin-ssg-precompile');
const debug = require('debug')('parcel-prototyper:pipeline');

// TODO: map to config
const BUNDLER_OPTIONS = {
    contentHash: false, // Disable content hash from being included on the filename
    scopeHoist: false, // turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
    hmr: true, // Enable or disable HMR while watching
    hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
    hmrHostname: '', // A hostname for hot module reload, default to ''
    detailedReport: false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
};

class Pipeline {

    /**
     * @param {Object} opts A valid parcel bundler configuration object
     */
    constructor(opts) {
        const bundlerOptions = Object.assign(BUNDLER_OPTIONS, opts);
        this.entryFiles = opts.entryFiles;
        this.bundler = new Bundler(this.entryFiles, bundlerOptions);
        this.addAssetTypes();

        this.bundler.on('bundled', this.handleBundled);
        this.bundler.on('buildStart', this.handleBuildStart);
        this.bundler.on('buildEnd', this.handleBuildEnd);
        this.bundler.on('buildError', this.handleBuildError);

        debug('Bundler options: %o', bundlerOptions)
    }

    handleBundled(bundle) {
        debug('Bundle complete: %o', bundle);
    }

    handleBuildStart(entryPoints) {
        debug('Bundling entrypoints: %s', entryPoints);
    }

    handleBuildEnd() {
        debug('Bundle complete');
    }

    handleBuildError(error) {
        if (error) {
            console.log(error.trace);

            throw error;
        }
    }

    addAssetTypes() {
        pluginAssetCsv(this.bundler);
        pluginSsg(this.bundler);
        pluginSsgPrecompile(this.bundler);
    }

    addPackagers() {
        // None yet!
    }

    async bundle() {
        let mainBundle

        debug(this.bundler);

        try {
            mainBundle = await this.bundler.bundle();
        } catch (error) {
            throw error;
        }

        return mainBundle
    }

    /**
     * Starts the watch task as well as a local development server
     * 
     * @param {Number} port 
     * @param {Boolean} https 
     * @param {String} hostname 
     */
    async serve(port, https, hostname) {
        try {
           await this.bundler.serve(port, https, hostname);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Pipeline