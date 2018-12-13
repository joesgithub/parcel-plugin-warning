"use strict";

const LocalForage = require('localforage');

const DB_CONFIG = {
    name: "session",
    description: "Stores all of the data from the user session"
}

class LocalDatabase {
    constructor(router, opts) {
        const config = DB_CONFIG;

        if (opts && opts.name) {
            config.name = name;
        }

        this.db = LocalForage.createInstance(config);
        this.router = router;
        this.length = 0;
        this.addEventListeners();
    }

    async set(key, value) {
        try {
            const output = await this.db.setItem(key, value);
            this.length = await this.db.length();
            
            return output;
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

    processForm(e) {
        if (e.preventDefault) e.preventDefault();

        const form = e.target || e.currentTarget;
        const formData = new FormData(form);
        const target = form.getAttribute('target') || window.location.href;

        for (var pair of formData.entries()) {
            const name = pair[0];
            const value = pair[1];

            this.set(name, value);
        }

        if (this.router) {
            this.router.navigate(target);
        }

        // You must return false to prevent the default form behavior
        return false;
    }

    addEventListeners() {
        window.addEventListener('load', () => {
            const forms = document.querySelectorAll('form');

            for (var form of forms) {
                form.addEventListener('submit', this.processForm.bind(this))
            }
        })
    }
}

module.exports = LocalDatabase