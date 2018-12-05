"use strict";

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
        let args = useYarn ? ['add'] : ['install', '--save'];

        args = args.concat(dependency);

        const proc = spawn.sync(command, args, {
            stdio: opts.verbose ? 'inherit' : 'ignore',
            cwd: opts.cwd || process.cwd()
        });

        if (proc.status !== 0) {
            throw new Error(`${command} ${args.join(' ')} failed`);
        }

        return true
    } catch (error) {
        throw error;
    }
  };