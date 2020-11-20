'use strict';

module.exports = function(bundler) {
  bundler.addAssetType("html", require.resolve("./WarningHTMLAsset"));
};