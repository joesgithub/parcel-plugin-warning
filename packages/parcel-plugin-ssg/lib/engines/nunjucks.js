"use strict";

module.exports = (engineModule, opts, bundleOptions) => {
    let views = [bundleOptions.rootDir];
    let loaders = [];

    if (opts.views && Array.isArray(opts.views)) {
        views = opts.views;
    }

    if (opts.loaders && Array.isArray(opts.loaders)) {
        loaders = opts.loaders;
    } else {
        loaders = [new engineModule.FileSystemLoader(views)];
    }

    const env = new engineModule.Environment(loaders, opts);

    for (var key in this.frontMatter) {
        env.addGlobal(key, this.frontMatter[key]);
    }

    env.addGlobal('globals', this.globals);

    return env;
}