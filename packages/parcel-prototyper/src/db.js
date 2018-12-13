"use strict";

const LocalForage = require('localforage');

const DB_CONFIG = {
    name: "session",
    description: "Stores all of the data from the user session"
}

class LocalDatabase {
    constructor(name) {
        const opts = DB_CONFIG;

        if (name) {
            opts.name = name;
        }

        this.db = LocalForage.createInstance(opts);
        this.length = 0;
    }

    async set(key, value) {
        try {
            const value = await this.db.setItem(key, value);
            this.length = await this.db.length();
            
            return value;
        } catch (error) {
            throw error;
        }
    }

    async get(key) {
        try {
            return await this.db.getItem(key);
        } catch (error) {
            throw error;
        }
    }

    async remove(key) {
        try {
            await this.db.removeItem(key);
            this.length = await this.db.length();
        } catch (error) {
            throw error;
        }
    }

    async clear() {
        try {
            await this.db.clear();
            this.length = await this.db.length();
        } catch (error) {
            throw error
        }
    }
}

module.exports = LocalDatabase