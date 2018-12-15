'use strict';

const debug = require('debug')('parcel-plugin-asset-fourohfour');

module.exports = (bundler) => {
  bundler.addAssetType('html', require.resolve("./404Asset"));
  bundler.addAssetType('htm', require.resolve("./404Asset"));
  bundler.addAssetType('css', require.resolve("./404Asset"));
};
