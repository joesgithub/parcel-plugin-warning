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
    entries: {
        doc: "Valid file types for entrypoints",
        format: "Array",
        default: ['**/*.html', '**/*.htm', '**/*.njk', '**/*.nunjucks'],
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
            default: "src/assets/",
            env: "ENTRY_DIR",
            arg: "entry-dir"
        },
        data: {
            doc: "The directory data files should be read from",
            format: "String",
            default: "src/data",
            env: "DATA_DIR",
            arg: "data-dir"
        },
        static: {
            doc: "The directory static files to be copied over as-is are stored",
            format: "String",
            default: "src/static/",
            env: "STATIC_DIR",
            arg: "static-dir"
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
    },
    watch: {
        doc: "Enable or disables filesystem watching for automatic rebuilds",
        format: "Boolean",
        default: false,
        arg: "watch"
    }
}