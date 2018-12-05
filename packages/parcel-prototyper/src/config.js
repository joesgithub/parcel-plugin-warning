"use strict";

const convict = require('convict');
const path = require('path');

class Config {
    schema = {
        env: {
            doc: "The application environment",
            format: ["production", "development", "test"],
            default: "development",
            env: "NODE_ENV"
        },
        port: {
            doc: "The port to bind the development server to",
            format: "port",
            default: 8080,
            env: "PORT",
            arg: "port"
        },
        hostname: {
            doc: "The hostname to bind the development server to",
            format: "String",
            default: "localhost",
            env: "HOSTNAME",
            arg: "hostname"
        },
        https: {
            doc: "Enable or disable HTTPS",
            format: "Boolean",
            default: false,
            env: "HTTPS",
            arg: "https"
        },
        cwd: {
            doc: "The desired current working directory; defaults to \"process.cwd()\"",
            format: "String",
            default: process.cwd(),
            arg: "cwd"
        },
        entryTypes: {
            doc: "Valid file types for entrypoints",
            format: "Array",
            default: ['html', 'htm'],
            env: "ENTRY_TYPES",
            arg: "entry-types"
        },
        publicUrl: {
            doc: "The url or base path the bundles are served from",
            format: "String",
            default: "/",
            env: "PUBLIC_URL",
            arg: "public-url"
        },
        template: {
            doc: "The template to be used when initializing a project",
            format: "String",
            default: "parcel-prototyper-template-default",
            env: "TEMPLATE",
            arg: "template"
        },
        dirs: {
            out: {
                doc: "The directory the built bundles should be output to",
                format: "String",
                default: "dist",
                env: "OUT_DIR",
                arg: "out-dir"
            },
            base: {
                doc: "The project's base path",
                format: "String",
                default: "src",
                env: "BASE_DIR",
                arg: "base-dir"
            },
            views: {
                doc: "The folder where views/entrypoints are stored",
                format: "String",
                default: "views",
                env: "VIEWS_DIR",
                arg: "views-dir"
            },
            cache: {
                doc: "The folder where the cache files are stored",
                format: "String",
                default: ".cache",
                env: "CACHE_DIR",
                arg: "cache-dir"
            }
        },
        cache: {
            doc: "Enables or disables bundle caching for faster rebuilds",
            format: "Boolean",
            default: true,
            env: "CACHE",
            arg: "cache"
        },
        logLevel: {
            doc: "Set the level of logs to be displayed",
            format: "int",
            default: 3,
            env: "LOG_LEVEL",
            arg: "log-level"
        },
        sourceMaps: {
            doc: "Enables or disables sourcemaps for bundles",
            format: "Boolean",
            default: true,
            env: "SOURCEMAPS",
            arg: "sourcemaps"
        }
    }
    
    constructor(config) {
        this.config = convict(this.schema)
        this.update(config)
    }

    get(property) {
        if (typeof property === "undefined") {
            return this.config.getProperties();
        } else {
            return this.config.get(property);
        }
    }

    update(config) {
        if (typeof config === "object") {
            this.config.load(config);
            this.resolveDirs();
            this.config.validate();

            return true
        }

        return false
    }

    resolveDirs() {
        const dirs = this.config.get('dirs');
        const cwd = this.config.get('cwd');
        const basePath = this.config.get('dirs.base');
        const keys = Object.keys(dirs).filter((k) => k !== "base");

        keys.forEach((k) => {
            const val = dirs[k];
            const resolvedVal = path.resolve(cwd, basePath, val);

            dirs[k] = resolvedVal;
        });

        this.config.set('dirs', dirs);
    }
}

module.exports = Config