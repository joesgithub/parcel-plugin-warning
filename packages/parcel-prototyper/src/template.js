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

    normalizeProjectPackage(projectPath) {
        const projectPkg = require(getFromProject('package.json'), projectPath);

        if (!projectPkg.scripts) {
            projectPkg.scripts = {}
        }

        projectPkg.scripts.start = 'pgen start';
        projectPkg.scripts.build = 'pgen build';
        projectPkg.scripts.update = 'pgen update';
    }

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

    resolveTemplateDependency(projectPkg) {
        const deps = projectPkg.dependencies.concat(projectPkg.devDependencies);
        const matchExp = new RegExp(/parcel-prototyper-template-.*?/);

        if (!deps) {
            return false;
        }

        const template = Object.keys(deps).filter((dep) => matchExp.exec(dep).length > 0);

        return template[0]
    }

    async installTemplateDependency(template) {
        const template = template || this.template;

        try {
            await npmInstall(template);
        } catch (error) {
            throw new Error(error);
        }
     }
}