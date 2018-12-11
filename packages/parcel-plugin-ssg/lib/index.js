'use strict';

const debug = require('debug')('parcel-plugin-ssg');
const extMap = require('./utils/extMap');

module.exports = (bundler) => {
    // TODO: setup data files
    //const dataDir = bundler.ssgOptions.dataDir || "_data";
    //const dataFiles = new DataFiles(dataDir);
    //const data = await dataFiles.getData();

    bundler.TEST_PARAM = 'dfhgjdfsghjsdf';

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
