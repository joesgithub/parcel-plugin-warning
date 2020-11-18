'use strict';

const debug = require('debug')('parcel-plugin-warning');

module.exports = (bundler) => {
  bundler.addAssetType('html', require.resolve("./WarningHTMLAsset"));
};
