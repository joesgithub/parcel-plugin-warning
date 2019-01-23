"use strict";

const debug = require("debug")("parcel-prototyper:template");
const fs = require("fs-extra");
const getFromProject = require("./utils/getFromProject");
const glob = require("glob");
const logger = require("parcel-bundler/lib/Logger");
const npmInstall = require("./utils/npmInstall");
const path = require("path");
const pathNormalize = require("normalize-path");
const pkg = require("../package.json");
const { prompt } = require("enquirer");
const resolveFilesystemDependencyPath = require('./utils/resolveFilesystemDependencyPath');

class Template {
  /**
   * @param {Object} configOpts A config options object
   */
  constructor(configOpts) {
    this.config = configOpts
    this.projectPath = this.config.cwd;
    this.template = this.getTemplateFromPackage() || configOpts.template;
    this.templateDependency = resolveFilesystemDependencyPath(this.template, this.projectPath);
    this.projectPkgPath = getFromProject("package.json", this.projectPath);
    this.scripts = {
        start: "parcel-prototyper start",
        build: "parcel-prototyper build",
        update: "parcel-prototyper update"
    }
    this.dependencies = [pkg.name, this.templateDependency];
  }

  /**
   * Creates a new project with a package.json containing a valid template configuration
   */
  async init() {
    try {
        this.createProject();
        await this.addScripts(this.scripts);
        await this.addDependencies(this.dependencies);
        this.getPaths();
        await this.addOrUpdateProjectFiles();
        return await this.runTemplateScript();
    } catch (error) {
        throw error;
    }
  }

  /**
   * Updates an existing project from its template
   */
  async update() {
    try {
        await this.addDependencies(this.dependencies);
        this.getPaths();
        await this.addOrUpdateProjectFiles();
        return await this.runTemplateScript();
    } catch (error) {
        throw error;
    }
  }

  /**
   * Initializes a new project with a package.json
   */
  createProject() {
    let projectPkg = {};
    const projectName = path.basename(this.projectPath);

    if (!fs.existsSync(this.projectPath)) {
        debug("Creating project at: %s", this.projectPath);
        fs.mkdirpSync(this.projectPath);
    }

    if (fs.existsSync(this.projectPkgPath)) {
        projectPkg = JSON.parse(fs.readFileSync(this.projectPkgPath));
    }

    projectPkg.name = projectName;
    projectPkg.version = "1.0.0";
    projectPkg.private = true;
    projectPkg.dependencies = {};
    projectPkg.scripts = {};

    debug("Writing `package.json` to: %s", this.projectPkgPath);
    return fs.writeFileSync(this.projectPkgPath, JSON.stringify(projectPkg, null, 4));
  }

  /**
   * Executes the logic in the template's `main` entry on the project
   */
  async runTemplateScript() {
    const templatePkg = JSON.parse(fs.readFileSync(this.templatePkgPath));
    const entryRelPath = templatePkg.main;
    const entryPath = path.resolve(this.templatePath, entryRelPath);

    try {
        if (fs.existsSync(entryPath)) {
            
            let entryData = {};
            const entry = require(entryPath);
            const templateConfig = Object.assign(
                this.config,
                {
                    addScripts: this.addScripts.bind(this),
                    addDependencies: this.addDependencies.bind(this)
                }
            )

            logger.log('Running template scripts...');
            debug('Executing template `main` script from %s', entryPath);

            switch (typeof entry) {
                case "function":
                    entryData = await entry(templateConfig);
                    break;
                case "object":
                    entryData = entry;
                    break;
            }

            debug('Template config %o', entryData);

            if (
                entryData.scripts
                && typeof entryData.scripts === "object"
            ) {
                await this.addScripts(entryData.scripts);
            }

            if (
                entryData.dependencies 
                && Array.isArray(entryData.dependencies)
                && entryData.dependencies.length > 0
            ) {
                await this.addDependencies(entryData.dependencies);
            }

            return true;
        }
    } catch (error) {
        throw error;
    }
  }

  /**
   * Adds one or more scripts to a package.json
   * 
   * @param {Object} scripts A valid NPM scripts object
   */
  async addScripts(scripts) {
    const projectPkg = JSON.parse(fs.readFileSync(this.projectPkgPath));

    for (var script in scripts) {
        const val = scripts[script];

        if (typeof val === "string") {
            debug("Adding script %s to project", script);
            projectPkg.scripts[script] = val;
        }
    }

    debug("Writing `package.json` to: %s", this.projectPkgPath);
    return fs.writeFileSync(this.projectPkgPath, JSON.stringify(projectPkg, null, 4));
  }

  /**
   * Installs the dependencies to the project
   * 
   * @param {String[]} dependencies Array of valid NPM dependencies
   */
  async addDependencies(dependencies) {
    let opts = {
      cwd: this.projectPath,
      verbose: this.config.logLevel > 3 ? true : false,
      link: this.config.DEVELOPER_MODE ? true : false
    };

    try {
      logger.log('Installing dependencies...');
      await npmInstall(dependencies, opts);

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds or updates the project's source files from the template
   */
  async addOrUpdateProjectFiles() {
    try {
        const entryFiles = glob.sync(path.join(this.config.templateDirs.entry, "**/*"));
        const staticFiles = glob.sync(path.join(this.config.templateDirs.static, "**/*"));
        const dataFiles = glob.sync(path.join(this.config.templateDirs.data, "**/*"));
        const copyFiles = async (files, source, destination) => {
            logger.log(`Copying ${source} to ${destination}`);

            for (var key in files) {
                const templateFilePath = pathNormalize(files[key]);
                const templateRelPath = path.normalize(templateFilePath.replace(pathNormalize(source), "./"));
                const projectTemplatePath = path.resolve(destination, templateRelPath);
                const isDirectory = fs.lstatSync(templateFilePath).isDirectory();
                const exists = fs.existsSync(projectTemplatePath);
                let answers = {
                  continue: false
                };
        
                if (isDirectory) {
                  fs.mkdirpSync(projectTemplatePath);
                } else {
                  if (exists) {
                    answers = await prompt({
                      type: "confirm",
                      name: "continue",
                      message: `Update ${templateRelPath}?`
                    });
                  }
        
                  if (!exists || answers.continue) {
                    fs.copySync(templateFilePath, projectTemplatePath);
                  }
                }
              }
        }

        return await Promise.all([
            copyFiles(entryFiles, this.config.templateDirs.entry, this.config.dirs.entry),
            copyFiles(staticFiles, this.config.templateDirs.static, this.config.dirs.static),
            copyFiles(dataFiles, this.config.templateDirs.data, this.config.dirs.data)
        ]);
      } catch (error) {
        throw error;
      }
  }

  /**
   * Resolves a project's template from it's package.json, returning the
   * first valid match found in "dependencies" or "devDependencies"
   */
  getTemplateFromPackage() {
    let template;

    if (this.projectPkgPath) {
        const projectPkg = JSON.parse(fs.readFileSync(this.projectPkgPath));
        const dependencies = projectPkg.dependencies || {};
        const devDependencies = projectPkg.devDependencies || {};
        const deps = Object.assign(devDependencies, dependencies);
        const matchExp = new RegExp(/parcel-prototyper-template-.*?/);

        if (!deps) {
            return false;
        }

        const templateMatches = Object.keys(deps).filter(
            dep => matchExp.exec(dep) !== null
        );

        template = templateMatches[0];
    }

    return template
  }

  /**
   * Resolve the absolute path to the template in "node_modules/"
   */
  getTemplatePath() {
    const templateName = this.getTemplateFromPackage();
    const templateEntryPath = require.resolve(templateName, {
      paths: [path.resolve(process.cwd(), this.projectPath)]
    });
    const templatePath = path.dirname(templateEntryPath);

    return templatePath;
  }

  /**
   * Gets any paths necessary from the template and project
   */
  getPaths() {
    this.templatePath = this.getTemplatePath();
    this.templatePkgPath = path.resolve(this.templatePath, "package.json");
    const templateDirs = {
        entry: path.resolve(this.templatePath, "src/assets/"),
        static: path.resolve(this.templatePath, "src/static/"),
        data: path.resolve(this.templatePath, "src/data/")
    }
    this.config = Object.assign(this.config, {
        templateDirs: templateDirs
    })
  }
}

module.exports = Template;