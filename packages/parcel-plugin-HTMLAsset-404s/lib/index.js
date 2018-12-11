'use strict';

module.exports = (bundler) => {
  bundler.addAssetType('html', require.resolve("./HTML404Asset.js"));
};
