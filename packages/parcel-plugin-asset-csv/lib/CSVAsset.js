const Asset = require('parcel-bundler/src/Asset');
const Papa = require('papaparse');
const serializeObject = require('parcel-bundler/src/utils/serializeObject');

class CSVAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
  }

  parse(code) {
    return Papa.parse(code).data;
  }

  generate() {
    return serializeObject(
      this.ast,
      this.options.minify && !this.options.scopeHoist
    );
  }
}

module.exports = CSVAsset;