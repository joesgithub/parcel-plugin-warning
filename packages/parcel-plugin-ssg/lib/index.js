'use strict';

const debug = require('debug')('parcel-plugin-ssg');
const extMap = require('./utils/extMap');

module.exports = (bundler) => {
    // Strip front matter from HTML
    bundler.addAssetType('html', require.resolve('./HTMLAsset'));
    bundler.addAssetType('htm', require.resolve('./HTMLAsset'));

    // Add all acceptable consolidate engines
    for (var engine in extMap) {
        const exts = extMap[engine];

        exts.forEach((ext) => {
            switch (ext) {
                case ".njk":
                    bundler.addAssetType(ext, require.resolve('./NunjucksAsset'));
                    break;
                case ".nunjucks":
                    bundler.addAssetType(ext, require.resolve('./NunjucksAsset'));
                    break;
                default:
                    bundler.addAssetType(ext, require.resolve('./ConsolidateAsset'));
                    break;
            }
        })
    }
};
