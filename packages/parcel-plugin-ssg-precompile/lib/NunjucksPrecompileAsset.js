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
            const precompiled = await this.precompile();
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
       * Precompiles a nunjucks asset
       * 
       */
      async precompile() {
        const trueContent = this.contents;
        const trueAst = this.ast;
        this.contents = this.rawContents;
        this.ast = undefined;

        await super.pretransform(true);
        await super.parseIfNeeded();
        await super.transform();
        const generated = await this.generate();
        const result = await super.postProcess(generated);
        const contents = result[0].value;

        debug(contents);

        // Automatically install Nunjucks if it's not found.
        const Nunjucks = await localRequire(this.engineModule, this.name);
        const precompiled = Nunjucks.precompileString(contents, {
            name: this.name
        });

        this.contents = trueContent;
        this.ast = trueAst;

        return precompiled
      }
}

module.exports = NunjucksPrecompileAsset