"use strict";

const debug = require("debug")("parcel-plugin-ssg:ConsolidateAsset");
const FrontMatterAsset = require("./FrontMatterAsset");
const fs = require("fs");
const localRequire = require("parcel-bundler/lib/utils/localRequire");
const path = require("path");
const resolveEngine = require("../utils/resolveEngine");
const resolveEngineModule = require("../utils/resolveEngineModule");

/**
 * Class extends FrontMatterAsset to add consolidate support to the standard
 * HTMLAsset pipeline
 */
class ConsolidateAsset extends FrontMatterAsset {
  constructor(name, options) {
    super(name, options);

    try {
      this.type = "html";
      this.ext = path.extname(this.name);
      this.engine = resolveEngine(this.ext);
      this.engineModule = resolveEngineModule(this.engine);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Hijack the load command to read and parse file
   * with Nunjucks instead of fs.readFileSync
   */
  async load() {
    try {
      // Load front matter for usage in consolidate
      const rawContents = await fs.readFileSync(this.name, this.encoding);
      this.rawContents = await this.getData(rawContents);

      let output;
      let consolidate = require("consolidate");
      const data = Object.assign(this.frontMatter, {
        globals: this.globals
      });

      // Automatically install engine module if it's not found
      const engineModule = await localRequire(this.engineModule, this.name);

      // Configure engine
      this.consolidate = await this.configureEngine(
        this.engine,
        engineModule,
        consolidate
      );

      debug("Data: %o", data);

      output = await this.consolidate[this.engine](this.name, data);

      return await this.parseFrontMatter(output);
    } catch (error) {
      throw error;
    }
  }

  // Start: TODO: Review at a later date

  /**
   * Adds a js output for the precompile output of supported engines
   * @param {String} generated
   */
  /* async postProcess(generated) {
    let allAssets = [];
    let mainAssets = await super.postProcess(generated);
    const clientAsset = {
        type: this.ext,
        value: this.templateContent
    };

    allAssets.push(clientAsset);
    allAssets = allAssets.concat(mainAssets);

    debug(allAssets);

    return allAssets;
  } */

  /*   async precompile(engine) {
        try {
            // Automatically install engine module if it's not found
            const engineModule = await localRequire(this.engineModule, this.name);

            switch (engine) {
                case "nunjucks":
                    const opts = {
                        name: this.name,
                        asFunction: true,
                        force: false,
                        env: this.consolidate.requires[this.engine]
                    }

                    return engineModule.precompileString(this.rawContents, opts);
                default:
                    return false;
            }
        } catch (error) {
            throw error;
        }
    } */

  // End: TODO: Review at a later date

  async configureEngine(engine, engineModule, consolidate) {
    try {
      let opts =
        (await this.getConfig([`.${this.engine}rc`, `.${this.engine}.js`], {
          packageKey: this.engine
        })) || {};
      const engineConfigPath = path.resolve(
        __dirname,
        "../engines",
        `${engine}.js`
      );
      const engineConfigExists = fs.existsSync(engineConfigPath);

      if (typeof opts === "function") {
        const locals = Object.assign(this.frontMatter, {
          globals: this.globals
        });

        opts = opts({ locals: locals, bundleOptions: this.options });
      }

      if (engineConfigExists) {
        const engineConfig = require(engineConfigPath)(
          engineModule,
          opts,
          this.options
        );

        consolidate.requires[this.engine] = engineConfig;
      } else {
        consolidate.requires[this.engine] = engineModule;
      }

      return consolidate;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ConsolidateAsset;
