"use strict";

const debug = require("debug")("parcel-plugin-warning:resolveUrlToFilePath");
const url = require('url');

/**
 * Converts a URL path to a valid file path
 */
module.exports = (path) => {
    const pathUrl = url.parse(path);
    const isRelUrl = pathUrl.hostname === null;
    const isRootPath = pathUrl.path.startsWith('/');
    const isSibling = pathUrl.path.startsWith('./');
    const isParent = pathUrl.path.startsWith('../');

    if (isRootPath) {
        return path.substring(1);
    }

    return path;
}