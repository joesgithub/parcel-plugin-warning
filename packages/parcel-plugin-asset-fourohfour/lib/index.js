'use strict';

const debug = require('debug')('parcel-plugin-asset-fourohfour');

module.exports = (bundler) => {
  bundler.addAssetType('html', require.resolve("./HTML404Asset"));
  bundler.addAssetType('htm', require.resolve("./HTML404Asset"));
  bundler.addAssetType('css', require.resolve("./CSS404Asset"));
};
