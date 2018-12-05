"use strict";

const debug = require('debug')('parcel-prototyper:template');
const fs = require('fs-extra');
const getFromProject = require('./utils/getFromProject');
const glob = require('glob');
const npmInstall = require('./utils/npmInstall');
const path = require('path');
const pkg = require('../package.json');

class Template {
    /**
     * 
     * @param {Object} opts 
     */
    constructor(opts) {
        this.projectPath = opts.projectPath
        this.template = opts.template
    }

    /**
     * Bootstraps a new project
     * 
     * @param {String} basePath The base path for a project template
     * @param {String} template A valid "name" of a template package
     * @param {String} projectPath
     */
    async bootstrap(basePath, template, projectPath) {
        projectPath = projectPath || this.projectPath
        template = template || this.template

        try {
            this.createProject(projectPath);
            this.normalizeProjectPackage();
            await this.installDependencies(template, projectPath);
            await this.copyTemplateToProject(basePath, projectPath);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Reinitializes a project from its template
     * 
     * @param {String} basePath The base path for a project template
     * @param {String} projectPath
     * @param {String} template A valid "name" of a template package
     */
    async update(basePath, template, projectPath) {
        projectPath = projectPath || this.projectPath
        template = template || this.template

        try {
            await this.installDependencies(template);
            await this.copyTemplateToProject(basePath, projectPath);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generates a new project with a package.json config
     * 
     * @param {String} projectPath
     */
    createProject(projectPath) {
        projectPath = projectPath || this.projectPath;
        const projectPkgPath = getFromProject('package.json', projectPath);
        const projectName = path.basename(projectPath);
        let projectPkg = {};
        
        if (!fs.existsSync(projectPath)) {
            debug('Creating project at: %s', projectPath)
            fs.mkdirpSync(projectPath);
        }

        if (!fs.existsSync(projectPkgPath)) {
            projectPkg = {}
        }

        projectPkg.name = projectName;
        projectPkg.version = '0.1.0';
        projectPkg.private = true;
        projectPkg.dependencies = {};
        projectPkg.scripts = {};

        debug('Writing `package.json` to: %s', projectPkgPath);
        fs.writeFileSync(projectPkgPath, JSON.stringify(projectPkg, null, 4));
    }

    /**
     * Normalizes a project package.json to include mandatory fields
     * 
     * @param {String} projectPath 
     */
    normalizeProjectPackage(projectPath) {
        projectPath = projectPath || this.projectPath;
        const projectPkgPath = getFromProject('package.json', projectPath);
        const projectPkg = require(projectPkgPath);

        if (!projectPkg.scripts) {
            projectPkg.scripts = {}
        }

        projectPkg.scripts.start = 'pgen start';
        projectPkg.scripts.build = 'pgen build';
        projectPkg.scripts.update = 'pgen update';

        debug('Writing `package.json` to: %s', projectPkgPath);
        fs.writeFileSync(projectPkgPath, JSON.stringify(projectPkg, null, 4));
    }

    /**
     * Copies the contents of a template package's `src` folder into the project
     * 
     * @param {String} projectPath 
     */
    async copyTemplateToProject(basePath, projectPath) {
        projectPath = projectPath || this.projectPath;
    
        try {
            const projectPkg = require(getFromProject('package.json', projectPath));
            const template = this.resolveTemplateDependency(projectPkg) || this.template;
            const nodeModulesPath = getFromProject('node_modules', projectPath);
            const templatePath = path.resolve(nodeModulesPath, template);
            const templateSrcPath = path.resolve(templatePath, 'src');
            const pattern = path.join(templateSrcPath, '**/*');
            const templateFiles = await glob.sync(pattern);

            for (var key in templateFiles) {
                const templateFilePath = templateFiles[key];
                const templateRelPath = path.normalize(templateFilePath.replace(templateSrcPath, "./"));
                const projectTemplatePath = path.resolve(projectPath, basePath, templateRelPath);
                const isDirectory = fs.lstatSync(templateFilePath).isDirectory();

                if (isDirectory) {
                    fs.mkdirpSync(projectTemplatePath);
                } else {
                    fs.copySync(templateFilePath, projectTemplatePath);
                }
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * Resolves the template package from the project's package.json
     * Looks in "dependencies" and "devDependencies" for the first valid template package
     * 
     * @param {Object} projectPkg 
     */
    resolveTemplateDependency(projectPkg) {
        const dependencies = projectPkg.dependencies || [];
        const devDependencies = projectPkg.devDependencies || [];
        const deps = Object.assign(devDependencies, dependencies);
        const matchExp = new RegExp(/parcel-prototyper-template-.*?/);

        if (!deps) {
            return false;
        }

        const template = Object.keys(deps).filter((dep) => matchExp.exec(dep) !== null);

        return template[0]
    }

    /**
     * Uses NPM to install all dependencies
     * 
     * @param {String} template A valid "name" of a template package
     */
    async installDependencies(template, projectPath) {
        template = template || this.template;
        projectPath = projectPath || this.projectPath;

        let deps = Object.keys(pkg.peerDependencies) || []
        let opts = {
            cwd: projectPath,
            verbose: true
        }

        deps.push(template)
        deps.push(pkg.name);

        if (process.env.DEVELOPER_MODE == "true") {
            opts.link = true;
        }

        try {
            await npmInstall(deps, opts);
        } catch (error) {
            throw error;
        }

        return true;
     }
}

module.exports = Template