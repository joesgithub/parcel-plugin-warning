'use strict';

const debug = require('debug')('parcel-plugin-ssg');
const extMap = require('./utils/extMap');

module.exports = (bundler) => {
    // Strip front matter from HTML
    bundler.addAssetType('html', require.resolve('./FrontMatterAsset'));
    bundler.addAssetType('htm', require.resolve('./FrontMatterAsset'));

    // Add all acceptable consolidate engines
    for (var engine in extMap) {
        const exts = extMap[engine];

        exts.forEach((ext) => {
            bundler.addAssetType(ext, require.resolve('./ConsolidateAsset'));
        })
    }
};
