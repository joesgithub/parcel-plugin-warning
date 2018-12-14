"use strict";

const path = require('path');

module.exports = (srcDir, entryTypes) => {
    const entryGlobs = entryTypes.map((type) => path.join(srcDir, `**/*.${type}`));

    return entryGlobs
}