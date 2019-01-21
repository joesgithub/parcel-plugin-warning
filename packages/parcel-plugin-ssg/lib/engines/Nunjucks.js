"use strict";

module.exports = (engineModule, opts) => {
    const loader = new engineModule.FileSystemLoader(this.options.rootDir);
    const env = new engineModule.Environment(loader, opts);

    for (var key in this.frontMatter) {
        env.addGlobal(key, this.frontMatter[key]);
    }

    env.addGlobal('globals', this.globals);

    return env;
}