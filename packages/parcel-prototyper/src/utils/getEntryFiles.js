"use strict";

const path = require('path');
const glob = require('glob');

module.exports = (srcDir, entryTypes) => {
    const entryGlobs = entryTypes.map((type) => path.join(srcDir, `**/*.${type}`));
    const entryFiles = entryGlobs.map((pattern) => glob.sync(pattern));

    return [].concat.apply([], entryFiles)
}