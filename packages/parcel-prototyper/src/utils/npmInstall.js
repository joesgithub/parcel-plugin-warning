"use strict";

const debug = require('debug')('parcel-prototyper:utils:npmInstall');
const spawn = require('cross-spawn');
const {execSync} = require('child_process');

const modes = {
    INSTALL: 0,
    LINK: 1
}

const clients = {
    NPM: 0,
    YARNPKG: 1
}

/**
 * Installs provided dependencies using Yarn or NPM
 *
 * @param {[String]} dependencies Any valid NPM dependencies
 */
module.exports = async (dependencies, opts = {}) => {
    let mode = opts.link ? modes['LINK'] : modes['INSTALL'];
    let client = shouldUseYarn() ? clients['YARNPKG'] : clients['NPM'];

    try {
        runCommand(client, mode, dependencies, opts);
        
        return true
    } catch (error) {
        throw error;
    }
  };

function shouldUseYarn() {
    try {
        execSync('yarnpkg --version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
  }

function runCommand(client, mode, dependencies, opts) {
    let cmd;
    let args = [];

    switch (client) {
        case clients['NPM']:
            cmd = "npm";
            args.push('install', '--save');

            break;
        case clients['YARNPKG']:
            cmd = "yarnpkg";
            args.push('add');

            break;
    }

    switch (mode) {
        case modes['INSTALL']:
            args = args.concat(dependencies);
            exec(cmd, args, opts);

            break;
        case modes['LINK']:
            args = args.concat(dependencies);
            exec(cmd, args, opts);

            for (var index in dependencies) {
                let linkArgs = [];

                linkArgs.push('link', dependencies[index]);
                exec(cmd, linkArgs, opts);
            }

            break;
    }

    return true;
}

function exec(command, args, opts) {
    const cmdString = `${command} ${args.join(' ')}`;

    try {
        debug('Running: %s', cmdString);

        const proc = spawn.sync(command, args, {
            stdio: opts.verbose ? 'inherit' : 'ignore',
            cwd: opts.cwd || process.cwd()
        });

        if (proc.status !== 0) {
            throw new Error(`${cmdString} failed`);
        }

        return true;
    } catch (error) {
        throw error;
    }
}