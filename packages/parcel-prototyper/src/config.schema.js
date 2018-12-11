"use strict";

module.exports = {
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
        default: ['html', 'htm', 'njk'],
        env: "ENTRY_TYPES",
        arg: "entry-types"
    },
    publicUrl: {
        doc: "The url or base path the bundles are served from; defaults to \"/\"",
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
        entry: {
            doc: "The project's entry path",
            format: "String",
            default: "src",
            env: "ENTRY_DIR",
            arg: "entry-dir"
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