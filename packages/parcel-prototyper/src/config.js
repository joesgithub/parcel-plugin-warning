"use strict";

const convict = require('convict');
const debug = require('debug')('parcel-prototyper:config');
const path = require('path');
const schema = require('./config.schema');

class Config {    
    constructor(config, opts) {
        const options = opts || {};
        this.schema = schema;
        this.config = convict(this.schema, options);
        this.update(config);
    }

    get(property) {
        if (typeof property === "undefined") {
            return this.config.getProperties();
        } else {
            return this.config.get(property);
        }
    }

    set(property, value) {
        debug('Updating property %s to %o', property, value);
        
        this.config.set(property, value);
        this.resolveDirs();
        this.config.validate();

        return this.config.get(property);
    }

    update(config) {
        let updated = false;

        debug('Updating config: %o', this.config.getProperties());

        if (typeof config === "object") {
            this.config.load(config);

            updated = true
        }

        this.resolveDirs();
        this.config.validate();

        debug('Updated config: %o', this.config.getProperties());

        return updated;
    }

    resolveDirs() {
        const dirs = this.config.get('dirs');
        const cwd = this.config.get('cwd');
        const keys = Object.keys(dirs);

        keys.forEach((k) => {
            const key = `dirs.${k}`;
            let val;
            let resolvedVal;

            val = this.config.get(key);            
            resolvedVal = path.resolve(cwd, val);

            debug('Resolving dir %s from %s to %s', k, val, resolvedVal);

            dirs[k] = resolvedVal;
        });

        this.config.set('dirs', dirs);
    }
}

module.exports = Config