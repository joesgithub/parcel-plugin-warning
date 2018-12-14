"use strict";

const debug = require('debug')('parcel-plugin-ssg-precompile:NunjucksPrecompileAsset');
const localRequire = require('parcel-bundler/lib/utils/localRequire');
const NunjucksAsset = require('parcel-plugin-ssg/lib/NunjucksAsset');

class NunjucksPrecompileAsset extends NunjucksAsset {
    /**
     * Adds a js output for the precompiled template
     * @param {*} content 
     */
    async postProcess(generated) {
        try {
            const mainAssets = await super.postProcess(generated);
            const precompiled = await this.precompile(this.rawGenerated);
            const precompileAsset = {
                type: 'js',
                value: precompiled
            }
            const allAssets = mainAssets.concat([precompileAsset]);
    
            return allAssets
        } catch (error) {
            throw error
        }
      }

      /**
       * Precompiles a nunjucks template string
       * 
       * @param {String} string 
       */
      async precompile(string) {
        // Automatically install engine module if it's not found. We need 
        // to do this before requiring consolidate so that it's available.
        const Nunjucks = await localRequire(this.engineModule, this.name);
        const precompiled = Nunjucks.precompileString(string, {
            name: this.name
        });

        return precompiled
      }
}

module.exports = NunjucksPrecompileAsset