"use strict";

const debug = require('debug')('parcel-plugin-htmlasset-404s');
const fs = require('fs');
const HTMLAsset = require('parcel-bundler/src/assets/HTMLAsset');

class HTML404Asset extends HTMLAsset {
    async load() {
        const exists = await fs.exists(this.name);

        debug('Asset exists: %s', exists);

        if (exists) {
            return await fs.readFile(this.name, this.encoding);
        }

        return '';
    }
}