'use strict';

module.exports = (bundler) => {
    throw new Error('fdhgsdfdghj')
    bundler.on('buildStart', (entryPoints) => {
        throw new Error(entryPoints);
    })
}
