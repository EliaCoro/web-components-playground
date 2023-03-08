const loadash = require('lodash');
const path = require('path');
const fs = require('fs');
const allConfigs = require('./configs');
const configs = allConfigs.configs;
const basePath = allConfigs.basePath;
const projectWrapperAppModulePath = allConfigs.projectWrapperAppModulePath;
const projectWrapperAppModuleTemplatePath = allConfigs.projectWrapperAppModuleTemplatePath;

const copyOriginalAppModule = (appModulePath) => {
  const originalAppModulePath = projectWrapperAppModulePath;
  const originalAppModuleContent = fs.readFileSync(originalAppModulePath, 'utf8');
  fs.writeFileSync(originalAppModulePath + '-copy', originalAppModuleContent);
};

const parseString = (string, variables) => {
  return loadash.template(string)(variables);
};

const saveFile = (filePath, fileContent) => {
  fs.writeFileSync(filePath, fileContent);
};

const readFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
};

const validateConfigs = (configs) => {
  if (!configs.projectWrapperPath) {
    throw new Error('projectWrapper is required');
  }
};

// Execution

validateConfigs(configs);

if (configs.copyOriginalAppModule) copyOriginalAppModule();

saveFile(
  projectWrapperAppModulePath,
  parseString(readFile(projectWrapperAppModuleTemplatePath), configs.data)
)