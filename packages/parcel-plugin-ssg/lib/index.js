'use strict';

const debug = require('debug')('parcel-plugin-ssg');
const extMap = require('./utils/extMap');

module.exports = (bundler) => {
    bundler.addAssetType('html', require.resolve('./assets/HTMLAsset'));
    bundler.addAssetType('htm', require.resolve('./assets/HTMLAsset'));
    bundler.addPackager('html', require.resolve('./packagers/ConsolidatePackager'));

    for (var engine in extMap) {
        const exts = extMap[engine];

        exts.forEach((ext) => {
            bundler.addAssetType(ext, require.resolve('./assets/ConsolidateAsset'));
        });

        bundler.addPackager(`${engine}-precompile.js`, require.resolve('./packagers/ConsolidatePrecompilePackager'));
    }
};
