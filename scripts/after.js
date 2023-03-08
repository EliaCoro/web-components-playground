const path = require('path');
const fs = require('fs');
const allConfigs = require('./configs');
const configs = allConfigs.configs;
const basePath = allConfigs.basePath;
const projectWrapperAppModulePath = allConfigs.projectWrapperAppModulePath;
const projectWrapperAppModuleTemplatePath = allConfigs.projectWrapperAppModuleTemplatePath;


const restoreOriginalFileModule = () => {
  const originalPath = projectWrapperAppModulePath.toString();
  const copyPath = originalPath.toString() + '-copy';

  // Check if the copy file exists
  if (!fs.existsSync(copyPath)) {
    console.log(`${copyPath} does not exist`);
    return;
  }

  const copyContent = fs.readFileSync(copyPath, 'utf8');

  fs.writeFileSync(originalPath, copyContent);

  // Delete the copy file
  fs.unlinkSync(copyPath);
};

if (configs.copyOriginalAppModule) restoreOriginalFileModule();
else console.log('nothing done since configs.copyOriginalAppModule is false')