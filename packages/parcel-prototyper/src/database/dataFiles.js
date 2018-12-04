"use strict";

const fs = require('fs');
const glob = require('glob');
const path = require('path');

class DataFiles {
    constructor(dataDir) {
        this.dir = dataDir
    }

    async getFilePaths(dir) {
        const pattern = path.join(dir, "**/*.{json,yml,toml,js}");
        const files = await glob(pattern);

        return files;
    }

    async getFiles(files) {
        const data = files.map((file) => {
            const ext = path.extname(file);

            switch (ext) {
                case "js":
                    return this.loadJS(file);
                case "json":
                    return this.loadJSON(file);
                case "yml":
                    return this.loadYAML(file);
                case "toml":
                    return this.loadTOML(file);
            }
        });

        return data;
    }

    async loadJS(path) {
        const data = require(path);

        if (typeof data === "function") {
            data = data();
        }

        return data;
    }

    async loadJSON(path) {
       const data = fs.readFileSync(path);
       const dataObj = JSON.parse(data);

       return dataObj;
    }

    async loadYAML(path) {
        const data = fs.readFileSync(path);
        
        return data;
    }

    async loadTOML(path) {
        const data = fs.readFileSync(path);

        return data;
    }
}