"use strict";

const moduleMap = require('../utils/moduleMap');

module.exports = function resolveEngineModule(engine) {
    const match = Object.keys(moduleMap).indexOf(engine);

    if (match) {
        return moduleMap[engine];
    } else {
        throw new Error(`No engineModule found for ${engine}`);
    }
}