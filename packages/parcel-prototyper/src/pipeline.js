"use strict";

const Bundler = require('parcel-bundler');
const pluginSsg = require('parcel-plugin-ssg');
const debug = require('debug')('parcel-bundler:pipeline');

// TODO: map to config
const BUNDLER_OPTIONS = {
    watch: false, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
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
        pluginSsg(this.bundler);
    }

    addPackagers() {

    }

    async build() {
        let mainBundle

        try {
            mainBundle = await this.bundler.bundle();
        } catch (error) {
            throw error;
        }

        return mainBundle
    }

    /**
     * Generates a bundle and then watches for changes and rebuilds
     */
    async watch() {
        // TODO;
    }

    /**
     * Starts the watch task as well as a local development server
     * 
     * @param {Number} port 
     * @param {Boolean} https 
     * @param {String} hostname 
     */
    async serve(port, https, hostname) {
        // TODO:
    }
}

module.exports = Pipeline