"use strict";

const Bundler = require('parcel-bundler');
const Debug = require('debug')('parcel-bundler:pipeline');

class Pipeline {
    // TODO: map to config
    bundlerOptions = {
        watch: false, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
        contentHash: false, // Disable content hash from being included on the filename
        scopeHoist: false, // turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
        hmr: true, // Enable or disable HMR while watching
        hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
        hmrHostname: '', // A hostname for hot module reload, default to ''
        detailedReport: false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
    };

    /**
     * @param {Object} opts A valid parcel bundler configuration object
     */
    constructor(opts) {
        this.entryFiles = opts.entryFiles;
        this.bundler = new Bundler(this.entryFiles, Object.assign(this.bundlerOptions, opts));
        this.bundler.on('bundled', this.handleBundled);
        this.bundler.on('buildStart', this.handleBuildStart);
        this.bundler.on('buildEnd', this.handleBuildEnd);
        this.bundler.on('buildError', this.handleBuildError);
    }

    handleBundled(bundle) {
        Debug('Bundle complete: %o', bundle);
    }

    handleBuildStart(entryPoints) {
        Debug('Bundling entrypoints: %s', entryPoints);
    }

    handleBuildEnd() {
        Debug('Bundle complete');
    }

    handleBuildError(error) {
        if (error) throw new Error(error);
    }

    async build() {
        let mainBundle

        try {
            mainBundle = await this.bundler.bundle();
        } catch (error) {
            throw new Error(error);
        }

        return mainBundle
    }
}

module.exports = Pipeline