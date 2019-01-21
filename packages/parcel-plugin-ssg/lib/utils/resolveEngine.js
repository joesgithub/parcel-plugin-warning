"use strict";

const extMap = require('../utils/extMap');

module.exports = function resolveEngine(ext) {
    let engine;

    for (var key in extMap) {
        const match = extMap[key].indexOf(`${ext}`) > -1;

        if (match) {
            engine = key;
            break
        }
    }

    if (engine) {
        return engine
    } else {
        throw new Error(`No engine found for ${this.name}`);
    }
}