"use strict";

const LocalForage = require('localforage');

class LocalDatabase {
    dataOpts = {
        name: "data",
        description: "Stores all of the data from data files"
    }
    sessionOpts = {
        name: "session",
        description: "Stores all of the data from the user session"
    }

    constructor(globalData) {
        this.data = LocalForage.createInstance(this.dataOpts)
        this.session = LocalForage.createInstance(this.sessionOpts)
        this.globalData = globalData
    }

    async loadGlobalData(globalData) {
        const data = globalData || this.globalData
        const keys = Object.keys(data);

        try {
            keys.forEach(async (key) => {
                const val = keys[key];

                await this.data.setItem(key, val);
            })
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = LocalDatabase