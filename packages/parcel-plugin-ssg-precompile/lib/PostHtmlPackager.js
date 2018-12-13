'use strict';

const debug = require('debug')('parcel-plugin-ssg-precompile:PostHtmlPackager');
const Packager = require('parcel-bundler/lib/packagers/Packager');

class PostHtmlPackager extends Packager {
  async addAsset(asset) {
    let html = asset.generated.html || '';

    // Find child bundles that have JS or CSS sibling bundles,
    // add them to the head so they are loaded immediately.
    let siblingBundles = Array.from(this.bundle.childBundles)
      .reduce((p, b) => p.concat([...b.siblingBundles.values()]), [])
      .filter(b => b.type === 'css' || b.type === 'js');

    if (siblingBundles.length > 0) {
      html = posthtml(
        this.insertSiblingBundles.bind(this, siblingBundles)
      ).process(html, {sync: true}).html;
    }

    await this.write(html);
  }
}

module.exports = PostHtmlPackager;