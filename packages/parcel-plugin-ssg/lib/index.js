'use strict';

const debug = require('debug')('parcel-plugin-ssg');
const extMap = require('./utils/extMap');

module.exports = (bundler) => {
    bundler.addAssetType('html', require.resolve('./assets/HTMLAsset'));
    bundler.addAssetType('htm', require.resolve('./assets/HTMLAsset'));

    for (var engine in extMap) {
        const exts = extMap[engine];

        exts.forEach((ext) => {
            bundler.addAssetType(ext, require.resolve('./assets/ConsolidateAsset'));
        });
    }
};
