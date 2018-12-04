'use strict';

const Config = require('./config');
const glob = require('glob');
const path = require('path');
const Pipeline = require('./pipeline');
const Template = require('./template');

(async () => {
    try {
        const config = new Config({dirs: { base: '../../' }, logLevel: 3, template: "file:../parcel-prototyper-template-default"});
        const entryFiles = getEntryFiles(config.get('dirs.views'), config.get('entryTypes'));
        const template = new Template({
            projectPath: config.get('dirs.base'),
            template: config.get('template')
        })
        const pipeline = new Pipeline({
            entryFiles: entryFiles,
            outDir: config.get('dirs.out'),
            publicUrl: config.get('publicUrl'),
            cache: config.get('cache'),
            cacheDir: config.get('dirs.cache'),
            logLevel: config.get('logLevel'),
            sourceMaps: config.get('sourceMaps')
        });

        await pipeline.build()
    } catch(error) {
        throw new Error(error)
    }
})()

function getEntryFiles(srcDir, entryTypes) {
    const entryGlobs = entryTypes.map((type) => path.join(srcDir, `**/*.${type}`));
    const entryFiles = entryGlobs.map((pattern) => glob.sync(pattern));

    return [].concat.apply([], entryFiles)
}