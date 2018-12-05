'use strict';

module.exports = (bundler) => {
  bundler.addAssetType('njk', require.resolve("./NunjucksAsset"));
};
