"use strict";

const ConsolidateAsset = require('parcel-plugin-ssg/lib/ConsolidateAsset');
const Nunjucks = require('nunjucks');

class NunjucksPrecompileAsset extends ConsolidateAsset {
    /**
     * Adds a js output for the precompiled template
     * @param {*} content 
     */
    async postProcess(generated) {
        try {
            const precompiled = Nunjucks.precompileString(this.rawContent, {
                name: this.name
            });
            const mainAssets = await super.postProcess(generated);
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
}

module.exports = NunjucksPrecompileAsset