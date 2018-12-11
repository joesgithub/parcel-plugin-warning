"use strict";

const debug = require('debug')('parcel-prototyper:utils:npmInstall');
const fs = require('fs-extra');
const getFromProject = require('./getFromProject')
const spawn = require('cross-spawn');

/**
 * Installs provided dependencies using Yarn or NPM
 *
 * @param {String|[String]} dependency A valid NPM dependency string
 */
module.exports = async (dependency, opts) => {
    opts = opts || {}

    try {
        const hasYarnLock = await fs.exists(getFromProject('yarn.lock'));
        const useYarn = hasYarnLock && !opts.ignoreYarn;
        const command = useYarn ? 'yarnpkg' : 'npm';
        let args = []
        
        if (useYarn) {
            args = opts.link 
                ? args.concat(['link'])
                : args.concat(['add']);
         } else {
            args = opts.link 
                ? args.concat(['link'])
                : args.concat(['install', '--save']);
         }

        if (opts.link) {
            dependency.forEach((arg) => {
                const a = args.concat(arg);
                
                exec(command, a, opts);
            })
        } else {
            args = args.concat(dependency);

            exec(command, args, opts);
        }

        return true
    } catch (error) {
        throw error;
    }
  };

function exec(command, args, opts) {
    try {
        const cmdString = `${command} ${args.join(' ')}`;
        const proc = spawn.sync(command, args, {
            stdio: opts.verbose ? 'inherit' : 'ignore',
            cwd: opts.cwd || process.cwd()
        });

        if (proc.status !== 0) {
            throw new Error(`${cmdString} failed`);
        }

        debug('Ran: %s', cmdString);
    } catch (error) {
        throw error;
    }
}