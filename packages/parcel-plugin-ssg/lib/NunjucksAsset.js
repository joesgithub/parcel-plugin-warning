'use strict';

const debug = require('debug')('parcel-plugin-ssg:NunjucksAsset');
const FrontMatterAsset = require('./FrontMatterAsset');
const localRequire = require('parcel-bundler/lib/utils/localRequire');
const path = require('path');

/**
 * Class extends HTMLAsset to add Nunjucks support
 */
class NunjucksAsset extends FrontMatterAsset {
    constructor(name, options) {
        super(name, options);

        this.ext = path.extname(this.name);
        this.engine = 'nunjucks';
        this.engineModule = 'nunjucks';
    }

    /**
     * Hijack pretransform to process template before collecting dependencies
     */
    async pretransform(precompile = false) {
        try {
            if (!precompile) {
                let output;

                // Automatically install engine module if it's not found.
                const Nunjucks = await localRequire(this.engineModule, this.name);
                const env = this.configureNunjucks(Nunjucks);

                output = env.renderString(this.contents);

                debug(output);

                this.contents = output;
            }

            await super.pretransform();
        } catch (error) {
            throw error
        }
    }

    resolvePartials(engine) {
        // TODO:
    }

    configureNunjucks(nunjucks) {
        const loader = new nunjucks.FileSystemLoader(this.options.rootDir);
        const env = new nunjucks.Environment(loader);

        for (var key in this.frontMatter) {
            env.addGlobal(key, this.frontMatter[key]);
        }

        env.addGlobal('globals', this.globals);

        return env;
    }
}

module.exports = NunjucksAsset;