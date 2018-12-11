"use strict";

const fs = require('parcel-bundler/src/utils/fs');
const glob = require('glob');
const json5 = require('json5');
const path = require('path');
const Papa = require('papaparse');
const toml = require('toml');
const yaml = require('js-yaml');

class DataFiles {
    constructor(dataDir) {
        this.dir = dataDir
    }

    async getFilePaths(dir) {
        dir = dir || this.dir;
        const pattern = path.join(dir, "**/*.{csv,json,yml,yaml,toml,js}");
        const files = glob.sync(pattern);

        return files;
    }

    async getData(file) {
        const ext = path.extname(file);

        switch (ext) {
            case ".csv":
                return await this.loadCSV(file);
            case ".js":
                return await this.loadJS(file);
            case ".json":
                return await this.loadJSON(file);
            case ".yml":
                return await this.loadYAML(file);
            case ".yaml":
                return await this.loadYAML(file);
            case ".toml":
                return await this.loadTOML(file);
            default:
                return {};
        }
    }

    async loadJS(path) {
        const data = require(path);

        if (typeof data !== "function") {
            return data
        }
    }

    async loadJSON(path) {
       const data = await fs.readFile(path, 'utf-8');

       return json5.parse(data);
    }

    async loadYAML(path) {
        const data = await fs.readFile(path, 'utf-8');
        
        return yaml.safeLoad(data);
    }

    async loadTOML(path) {
        const data = await fs.readFile(path, 'utf-8');

        return toml.parse(data);
    }

    async loadCSV(path) {
        const data = await fs.readFile(path, 'utf-8');

        return Papa.parse(data).data;
    }
}

module.exports = DataFiles;