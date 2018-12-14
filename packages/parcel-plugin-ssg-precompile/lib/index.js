'use strict';

module.exports = (bundler) => {
  bundler.addAssetType('.njk', require.resolve("./NunjucksPrecompileAsset"));
  bundler.addAssetType('.nunjucks', require.resolve("./NunjucksPrecompileAsset"));
};
