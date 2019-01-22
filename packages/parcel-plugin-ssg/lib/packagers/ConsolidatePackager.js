"use strict";

const debug = require('debug')('parcel-plugin-ssg:ConsolidatePackager');
const HTMLPackager = require('parcel-bundler/lib/packagers/HTMLPackager');
const path = require('path');
const urlJoin = require('parcel-bundler/lib/utils/urlJoin');

class ConsolidatePackager extends HTMLPackager {
    constructor(bundle, bundler) {
        super(bundle, bundler);
    }

    insertSiblingBundles(siblingBundles, tree) {
        const bundles = [];
    
        debug(this.bundle);

        for (let bundle of this.bundle.siblingBundles) {
          if (bundle.type.indexOf('precompile') > -1) {
            bundles.push({
                tag: 'script',
                attrs: {
                  src: urlJoin(this.options.publicURL, path.basename(bundle.name))
                }
              });
          }
        }
    
        this.addBundlesToTree(bundles, tree);
        super.insertSiblingBundles(siblingBundles, tree);
      }
}

module.exports = ConsolidatePackager;