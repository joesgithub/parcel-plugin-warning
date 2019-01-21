"use strict";

const Bundler = require('parcel-bundler');
const fs = require('fs-extra');
const pluginAssetCsv = require('parcel-plugin-asset-csv');
const pluginFourOhFour = require('parcel-plugin-asset-fourohfour');
const pluginSsg = require('parcel-plugin-ssg');
const debug = require('debug')('parcel-prototyper:pipeline');

class Pipeline {
    /**
     * @param {Object} opts A valid parcel-prototyper config object
     */
    constructor(opts) {
        const bundlerOptions = {
            outDir: opts.dirs.out, // The out directory to put the build files in, defaults to dist
            outFile: null, // The name of the outputFile
            publicUrl: opts.publicUrl, // The url to server on, defaults to dist
            watch: opts.watch, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
            cache: opts.cache, // Enabled or disables caching, defaults to true
            cacheDir: opts.dirs.cache, // The directory cache gets put in, defaults to .cache
            contentHash: false, // Disable content hash from being included on the filename
            minify: process.env.NODE_ENV === 'production' ? true : false, // Minify files, enabled if process.env.NODE_ENV === 'production'
            scopeHoist: false, // turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
            target: 'browser', // browser/node/electron, defaults to browser
            https: opts.https,
            logLevel: opts.logLevel, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
            hmr: true, //Enable or disable HMR while watching
            hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
            sourceMaps: opts.sourceMaps, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
            hmrHostname: '', // A hostname for hot module reload, default to ''
            detailedReport: opts.logLevel > 3 ? true : false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
        };
        this.entryFiles = opts.entryFiles;
        this.bundler = new Bundler(this.entryFiles, bundlerOptions);
        this.bundler.options.prototyper = opts;
        this.addPlugins();

        this.bundler.on('bundled', this.handleBundled.bind(this));
        this.bundler.on('buildStart', this.handleBuildStart.bind(this));
        this.bundler.on('buildEnd', this.handleBuildEnd.bind(this));
        this.bundler.on('buildError', this.handleBuildError.bind(this));

        debug('Bundler options: %O', bundlerOptions)
    }

    handleBundled(bundle) {
        debug('Bundle complete: %O', bundle);

        this.copyStatic(
            this.bundler.options.prototyper.dirs.static,
            this.bundler.options.prototyper.dirs.out    
        );
    }

    handleBuildStart(entryPoints) {
        debug('Bundling entrypoints: %o', entryPoints);
    }

    handleBuildEnd() {
        debug('Bundle complete');
    }

    handleBuildError(error) {
        if (error) {
            throw error;
        }
    }

    addPlugins() {
        pluginFourOhFour(this.bundler);
        pluginAssetCsv(this.bundler);
        pluginSsg(this.bundler);
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

    /**
     * Copies the contents of dirs.static to dirs.output
     * 
     * @param {String} staticPath 
     */
    async copyStatic(staticPath, outDir) {    
        try {
            await fs.copy(staticPath, outDir);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Pipeline