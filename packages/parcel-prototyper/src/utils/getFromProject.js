"use strict";

const path = require('path');

/**
 * Resolves a relative path from project directory
 */
module.exports = (relativePath, cwd) => {
    cwd = cwd || process.cwd();
    const resolveApp = path.resolve(cwd, relativePath);

    return resolveApp;
};