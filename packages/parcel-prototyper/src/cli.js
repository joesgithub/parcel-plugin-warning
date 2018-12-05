"use strict";

// unhandled promise rejections are deprecated; this will terminate the program in the future!
process.on('unhandledRejection', r => console.log(r));

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
    .action(bundle);

program
    .command('update [path]')
    .description('Update an existing project')
    .option(
        '-t, --template <template>',
        'Override the default project template'
    )
    .action(bundle);

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
    .action(bundle);

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
    .action(bundle);

program
    .command('help [command]')
    .description('Display help for all or specified commands')
    .action((command) => {
        let cmd = program.commands.find((c) => c.name() === command || program);
        cmd.help();
    });

program
    .on('--help', () => {
        console.log('');
        console.log(
            '  Run `' +
            'pgen help <command>' +
            '` for more information on specific commands'
        );
        console.log('');
    })

// Make serve the default command except for --help
var args = process.argv;
if (args[2] === '--help' || args[2] === '-h') args[2] = 'help';
if (!args[2] || !program.commands.some(c => c.name() === args[2])) {
  args.splice(2, 0, 'serve');
}

program.parse(args);

async function bundle(main, command) {
    // Require library here to make commands faster
    const cmd = command ? command : main;
    const action = cmd.name();

    try {
        const Config = require('./config');
        const getEntryFiles = require('./utils/getEntryFiles');
        const Pipeline = require('./pipeline');
        const Template = require('./template');

        // Setup default command paramaters
        cmd.environment = "development";
        cmd.throwErrors = false;
        cmd.scopeHoist = false;

        // Setup command paramaters for specific actions
        switch (action) {
            case "init":
                // TODO:
                break;
            case "update":
                // TODO:
                break;
            case "build":
                cmd.env = "production"
                process.env.NODE_ENV = process.env.NODE_ENV || 'production';
            case "watch":
                // TODO:
                cmd.watch = true;
                break;
            case "serve":
                // TODO:
                break;
        }

        const config = new Config(); // TODO: ensure CLI args get passed
        const entryFiles = getEntryFiles(config.get('dirs.views'), config.get('entryTypes'));
        const template = new Template({
            projectPath: config.get('cwd'),
            template: config.get('template')
        })
        const pipeline = new Pipeline({
            entryFiles: entryFiles,
            outDir: config.get('dirs.out'),
            publicUrl: config.get('publicUrl'),
            cache: config.get('cache'),
            cacheDir: config.get('dirs.cache'),
            logLevel: config.get('logLevel'),
            sourceMaps: config.get('sourceMaps')
        });

        // Execute action
        switch (action) {
            case "init":
                await template.bootstrap(config.get('dirs.base'), command.template, main);
            break;
            case "update":
                await template.update(config.get('dirs.base'), command.template, main);
            break;
            case "build":
                await pipeline.build();
            break;
            case "watch":
                await pipeline.watch();
            break;
            case "serve":
                await pipeline.serve(
                    config.get('port'),
                    config.get('https'),
                    config.get('hostname')
                );
            break;
        }
    } catch (error) {
        console.log(error);
    }
}