"use strict";

const path = require('path');

/**
* Resolves an filesystem NPM dependency relative from the CWD
* 
* @param {String} template 
* @param {String} projectPath 
*/
function resolveFilesystemDependencyPath(template, projectPath) {
 const fileRegex = /^file:/;
 const match = fileRegex.test(template);
 const relPath = path.relative(projectPath, process.cwd());

 if (match) {
   const templatePath = template.substring(5);

   return "file:" + path.join(relPath, templatePath);
 }

 return template;
}

module.exports = resolveFilesystemDependencyPath;