"use strict";

const fs = require('parcel-bundler/lib/utils/fs');
const glob = require('glob');
const json5 = require('json5');
const logger = require('parcel-bundler/src/Logger');
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
        const pattern = path.join(dir, "**/*.{csv,json,yml,yaml,toml}"); // TODO: add JS support
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
        try {
            const contents = require(path);
            
            return this.parseJS(contents);
        } catch (error) {
            logger.warn(`Could not process data file ${path}`);
        }
    }

    parseJS(data) {
        switch (typeof data) {
            case "object":
                return data
            case "function":
                const returnData = data();
                return this.parseJS(returnData);
            default:
                throw new Error('Invalid export')
        }
    }

    async loadJSON(path) {
        try { 
            const data = await fs.readFile(path, 'utf-8');

            return json5.parse(data);
        } catch (error) {
            logger.warn(`Could not process data file ${path}`);
        }
    }

    async loadYAML(path) {
        try {
            const data = await fs.readFile(path, 'utf-8');
        
            return yaml.safeLoad(data);
        } catch (error) {
            logger.warn(`Could not process data file ${path}`);
        }
    }

    async loadTOML(path) {
        try {
            const data = await fs.readFile(path, 'utf-8');

            return toml.parse(data);
        } catch (error) {
            logger.warn(`Could not process data file ${path}`);
        }
    }

    async loadCSV(path) {
        try {
            const data = await fs.readFile(path, 'utf-8');

            return Papa.parse(data).data;
        } catch (error) {
            logger.warn(`Could not process data file ${path}`);
        }
    }
}

module.exports = DataFiles;