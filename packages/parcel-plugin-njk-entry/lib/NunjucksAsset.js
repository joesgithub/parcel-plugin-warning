'use strict';

const debug = require('debug')('parcel-plugin-njk')
const HTMLAsset = require('parcel-bundler/src/assets/HTMLAsset');
const Nunjucks = require('nunjucks');
const path = require('path');



/**
 * Class extands HTMLAsset to add Nunjucks pre-parsing
 * to the standard Parcel HTML pipeline
 */
class NunjucksAsset extends HTMLAsset {
  constructor(name, options) {
    super(name, options);

    this.configFiles = ['.nunjucksrc', '.nunjucks.js', 'nunjucks.config.js']
    this.configOpts = { 
      packageKey: 'nunjucks'
    }
  }

  /**
   * Hijack the load command to read and parse file
   * with Nunjucks instead of fs.readFileSync
   */
  async load() {
    const rawConfig = (await this.getConfig(this.configFiles, this.configOpts));
    const config = (typeof rawConfig === "function") ? rawConfig() : rawConfig;
    const view = this.name;
    const env = config.env || this.configureNunjucks(config)
    let output
    
    // Catch errors
    try {
      output = await new Promise((resolve, reject) => {
        env.render(view, (err, output) => {
          if (err) reject(err)

          resolve(output)
        })
      })
    } catch (err) {
      throw new Error(err)
    }

    debug('%o', output)

    return output
  }

  /**
   * Collect and properly resolve dependencies from Nunjucks extends, macros, and includes
   */
  dsfasddasfcollectDependencies() {
    super.collectDependencies()

    let {ast} = this

    ast.walk(node => {
      if (node.attrs) {
        for (let attr in node.attrs) {
          let elements = ATTRS[attr];
          // Check for virtual paths
          if (node.tag === 'a' && node.attrs[attr].lastIndexOf('.') < 1) {
            continue;
          }

          if (elements && elements.includes(node.tag)) {
            let depHandler = this.getAttrDepHandler(attr);
            let options = OPTIONS[node.tag];
            node.attrs[attr] = depHandler.call(
              this,
              node.attrs[attr],
              options && options[attr]
            );
            this.isAstDirty = true;
          }
        }
      }

      return node;
    });
  }

  /**
   * Configure a Nunjucks Environment Class
   * 
   * @param {Object} config  
   */
  configureNunjucks(config) {
    const viewDirs = config.root || this.options.rootDir;
    const views = this.resolveRoot(viewDirs)
    const fileSystemLoader = new Nunjucks.FileSystemLoader(views, config.opts)
    const env = new Nunjucks.Environment(fileSystemLoader, config.opts)

    debug('config: %o', config)
    debug('viewDirs: %o', viewDirs)
    debug('views: %o', views)

    return env
  }

  /**
   * Properly resolves the root paths from the project root
   * 
   * @param {string|[string]} root 
   */
  resolveRoot(root) {
    if (Array.isArray(root)) {
      return root.map((p) => path.resolve(process.cwd(), p));
    } else {
      return path.resolve(process.cwd(), root);
    }
  }
}

module.exports = NunjucksAsset;