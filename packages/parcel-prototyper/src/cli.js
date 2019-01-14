"use strict";

// unhandled promise rejections are deprecated; this will terminate the program in the future!
process.on('unhandledRejection', r => console.log(r));

require('v8-compile-cache');
const debug = require('debug')('parcel-prototyper:cli');
const program = require('commander');
const version = require('../package.json').version;

program.version(version);

// TODO: set option descriptions from config where applicable
program
    .command('init <path>')
    .description('Initialize a new prototype')
    .option(
        '-t, --template <template>',
        'Override the default project template'
    )
    .action(bundle);

program
    .command('update <path>')
    .description('Update an existing project')
    .option(
        '-t, --template <template>',
        'Override the default project template'
    )
    .action(bundle);

program
    .command('serve [entry...]')
    .description('Start a development server and watch for changes')
    .option(
        '-p, --port <port>',
        'Set the port the development server binds to'
    )
    .option(
        '-h, --hostname <hostname>',
        'Set the hostname the development server binds to'
    )
    .option(
        '--https',
        'Enable HTTPs for the development server'
    )
    .option(
        '--open [browser]',
        'Automatically open the development server in the browser specified; defaults to the default OS browser'
    )
    .option(
        '-e, --entry-dir <entry-dir>',
        'Set the entry directory relative to the project; defaults to the "src"'
    )
    .option(
        '-d, --out-dir <out-dir>',
        'Set the output directory.'
    )
    .option(
        '--cache-dir <cache-dir>',
        'Set the cache directory; defaults to ".cache"'
    )
    .option(
        '-p, --public-url <public-url>',
        'Set the public URL to serve from; defaults to "/"'
    )
    .option(
        '--no-cache',
        'Disable the filesystem cache'
    )
    .option(
        '--no-sourcemaps',
        'Disable sourcemaps'
    )
    .option(
        '--log-level <log-level>',
        'Set the log level; 0 (no output), 1 (errors), 2 (warnings), 3 (info), 4 (verbose), 5 (debug, generates a log file)',
        /^([0-5])$/
    )
    .option('-V, --version', 'output the version number')
    .action(bundle);

program
    .command('build [entry...]')
    .description('Generate a production build')
    .option(
        '-w, --watch',
        'Watches filesystem for changes and triggers a rebuild'
    )
    .option(
        '-e, --entry-dir <entry-dir>',
        'Set the entry directory relative to the project; defaults to "src"'
    )
    .option(
        '-d, --out-dir <out-dir>',
        'Set the output directory.'
    )
    .option(
        '--cache-dir <cache-dir>',
        'Set the cache directory; defaults to ".cache"'
    )
    .option(
        '-p, --public-url <public-url>',
        'Set the public URL to serve from; defaults to "/"'
    )
    .option(
        '--no-cache',
        'Disable the filesystem cache'
    )
    .option(
        '--no-sourcemaps',
        'Disable sourcemaps'
    )
    .option(
        '--log-level <log-level>',
        'Set the log level; 0 (no output), 1 (errors), 2 (warnings), 3 (info), 4 (verbose), 5 (debug, generates a log file)',
        /^([0-5])$/
    )
    .option(
        '--detailed-report',
        'print a detailed build report after a completed build'
    )
    .option('-V, --version', 'output the version number')
    .action(bundle);

program
    .command('help [command]')
    .description('Display help for all or specified commands')
    .action((command) => {
        let cmd;

        for (var i in program.commands) {
            cmd = (program.commands[i].name() === command)
                ? program.commands[i]
                : program
        }

        cmd.help();
    });

// Make serve the default command except for --help
var args = process.argv;
if (args[2] === '--help' || args[2] === '-h') args[2] = 'help';
if (!args[2] || !program.commands.some(c => c.name() === args[2])) {
    args.splice(2, 0, 'serve');
}

program.parse(args);

async function bundle(main, command) {
    // Require libraries here to make commands faster
    const Config = require('./config');
    const getEntryFiles = require('./utils/getEntryFiles');
    const Pipeline = require('./pipeline');
    const path = require('path');
    const rimraf = require('rimraf');
    const Template = require('./template');

    // TODO: refactor "configOpts" to config class calls
    try {
        const cmd = command && typeof command.name === "function"
            ? command
            : main;
        const action = cmd.name()
        const cwd = action == "init" || action == "update"
            ? path.resolve(process.cwd(), main)
            : process.cwd();
        const config = new Config({cwd: cwd});
        const configOpts = config.get();
        let template;
        let pipeline;

        // Enable developer mode
        if (process.env.DEVELOPER_MODE == "true") {
            configOpts.DEVELOPER_MODE = true;
            configOpts.verbose = true;
        }

        // Override configOpts for specific actions
        switch (action) {
            case "init":
                configOpts.cwd = path.resolve(process.cwd(), main);
                break;
            case "update":
                configOpts.cwd = path.resolve(process.cwd(), main);
                break;
            case "build":
                configOpts.env = "production"
                process.env.NODE_ENV = process.env.NODE_ENV || 'production';
                configOpts.entries = main.length > 0
                    ? main
                    : configOpts.entries;
                break;
            case "serve":
                configOpts.watch = true
                configOpts.entries = main.length > 0
                    ? main
                    : configOpts.entries;
                break;
        }

        configOpts.entryFiles = getEntryFiles(configOpts.dirs.entry, configOpts.entries);
        template = new Template(configOpts)
        pipeline = new Pipeline(configOpts);

        // Execute action
        switch (action) {
            case "init":
                await template.init();
                break;
            case "update":
                await template.update();
                break;
            case "build":
                rimraf.sync(configOpts.dirs.out);
                rimraf.sync(configOpts.dirs.cache);
                await pipeline.bundle();
                break;
            case "serve":
                await pipeline.serve(
                    configOpts.port,
                    configOpts.https,
                    configOpts
                );
                break;
        }
    } catch (error) {
        console.log(error);
    }
}