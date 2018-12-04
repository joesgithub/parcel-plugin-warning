"use strict";

require('v8-compile-cache');
const program = require('commander');
const version = require('../package.json').version;

program.version(version);

// TODO: set option descriptions from config where applicable
program
    .command('init [path]')
    .description('Initialize a new prototype')
    .option(
        '-t, --template <template>',
        'Override the default project template'
    )
    .action(`todo:`)

program
    .command('serve')
    .description('Start a development server and watch for changes')
    .option(
        '-p, --port <port>',
        'Set the port the development server binds to'
    )
    .option(
        '-h, --hostname',
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
        '-b, --base-dir',
        'Set the base directory relative to the project; defaults to the project root'
    )
    .option(
        '-d, --out-dir',
        'Set the output directory.'
    )
    .option(
        '--views-dir',
        'Set the views directory; defaults to "src"'
    )
    .option(
        '--cache-dir',
        'Set the cache directory; defaults to ".cache"'
    )
    .option(
        '-p, --public-url',
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
        '--log-level',
        'Set the log level; 0 (no output), 1 (errors), 2 (warnings), 3 (info), 4 (verbose), 5 (debug, generates a log file)',
        /^([0-5])$/
    )
    .option('-V, --version', 'output the version number')
    .action(`TODO:`)

program
    .command('build')
    .description('Generate a production build')
    .option(
        '-p, --port <port>',
        'Set the port the development server binds to'
    )
    .option(
        '-h, --hostname',
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
        '-b, --base-dir',
        'Set the base directory relative to the project; defaults to the project root'
    )
    .option(
        '-d, --out-dir',
        'Set the output directory.'
    )
    .option(
        '--views-dir',
        'Set the views directory; defaults to "src"'
    )
    .option(
        '--cache-dir',
        'Set the cache directory; defaults to ".cache"'
    )
    .option(
        '-p, --public-url',
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
        '--log-level',
        'Set the log level; 0 (no output), 1 (errors), 2 (warnings), 3 (info), 4 (verbose), 5 (debug, generates a log file)',
        /^([0-5])$/
    )
    .option(
        '--detailed-report',
        'print a detailed build report after a completed build'
    )
    .option('-V, --version', 'output the version number')
    .action(`TODO:`)

program
    .command('help [command]')
    .description('Display help for all or specified commands')
    .action((command) => {
        let cmd = program.commands.find((c) => c.name() === command || program)
        cmd.help()
    })

program
    .on('--help', () => {
        console.log('');
        console.log(
            '  Run `' +
            chalk.bold('pgen help <command>') +
            '` for more information on specific commands'
        );
        console.log('');
    })