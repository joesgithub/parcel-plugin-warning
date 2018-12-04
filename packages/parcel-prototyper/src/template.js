"use strict";

const debug = require('debug')('parcel-prototyper:template');
const fs = require('fs-extra');
const getFromProject = require('./utils/getFromProject');
const glob = require('glob');
const npmInstall = require('./utils/npmInstall');
const path = require('path');

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
     * @param {String} projectPath
     * @param {String} template A valid "name" of a template package
     */
    async bootstrap(projectPath, template) {
        this.createProject(projectPath);
        this.normalizeProjectPackage();
        await this.installTemplateDependency(template);
        await this.copyTemplateToProject(projectPath);
    }

    /**
     * Reinitializes a project from its template
     * 
     * @param {String} projectPath
     * @param {String} template A valid "name" of a template package
     */
    async update(projectPath, template) {
        await this.installTemplateDependency(template);
        await this.copyTemplateToProject(projectPath);
    }

    /**
     * Generates a new project with a package.json config
     * 
     * @param {String} projectPath
     */
    createProject(projectPath) {
        const projectPath = path || this.projectPath;
        const projectPkgPath = getFromProject('package.json', projectPath);
        const projectName = path.basename(projectPath);
        let projectPkg = {};
        
        if (!fs.existsSync(projectPath)) {
            debug('Creating project at: %s', projectPath)
            fs.mkdirpSync(projectPath);
        }

        if (!fs.existsSync(projectPkgPath)) {
            projectPkg = {
                name: projectName,
                version: '0.1.0',
                private: true,
                dependencies: {},
                scripts: {}
              };
        }

        debug('Writing `package.json` to: %s', projectPkgPath);
        fs.writeFileSync(projectPkgPath, JSON.stringify(projectPkg, null, 4));
    }

    /**
     * Normalizes a project package.json to include mandatory fields
     * 
     * @param {String} projectPath 
     */
    normalizeProjectPackage(projectPath) {
        const projectPkg = require(getFromProject('package.json'), projectPath);

        if (!projectPkg.scripts) {
            projectPkg.scripts = {}
        }

        projectPkg.scripts.start = 'pgen start';
        projectPkg.scripts.build = 'pgen build';
        projectPkg.scripts.update = 'pgen update';
    }

    /**
     * Copies the contents of a template package's `src` folder into the project
     * 
     * @param {String} projectPath 
     */
    async copyTemplateToProject(projectPath) {
        const projectPath = projectPath || this.projectPath;
        const projectPkg = require(getFromProject('package.json'), projectPath);
        const template = this.resolveTemplateDependency(projectPkg);
        const nodeModulesPath = getFromProject('node_modules', projectPath);
        const templatePath = path.resolve(nodeModulesPath, template);
        const templateSrcPath = path.resolve(templatePath, 'src');

        try {
            const pattern = path.join(templateSrcPath, '**/*');
            const templateFiles = await glob.sync(pattern);

            for (var key in templateFiles) {
                const templateFilePath = templateFiles[key];
                const templateRelPath = path.normalize(templateFilePath.replace(templateSrcPath, "./"));
                const projectPath = path.resolve(projectPath, templateRelPath);
                const isDirectory = fs.lstatSync(templateFilePath).isDirectory();

                if (isDirectory) {
                    fs.mkdirpSync(projectPath);
                } else {
                    fs.copySync(templateFilePath, projectPath);
                }
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Resolves the template package from the project's package.json
     * Looks in "dependencies" and "devDependencies" for the first valid template package
     * 
     * @param {Object} projectPkg 
     */
    resolveTemplateDependency(projectPkg) {
        const deps = projectPkg.dependencies.concat(projectPkg.devDependencies);
        const matchExp = new RegExp(/parcel-prototyper-template-.*?/);

        if (!deps) {
            return false;
        }

        const template = Object.keys(deps).filter((dep) => matchExp.exec(dep).length > 0);

        return template[0]
    }

    /**
     * Uses NPM to install a valid template package
     * 
     * @param {String} template A valid "name" of a template package
     */
    async installTemplateDependency(template) {
        const template = template || this.template;

        try {
            await npmInstall(template);
        } catch (error) {
            throw new Error(error);
        }
     }
}