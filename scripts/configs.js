const path = require('path');
const fs = require('fs');

const basePath = path.resolve(__dirname, `../`);

if (!(fs.existsSync(path.resolve(__dirname, './data.json')))) {
  throw new Error(`data.json does not exist. You can create it by lunching the command: node scripts/extract-data.js <your-lib-name>`);
}

const configs = {
  copyOriginalAppModule: true,
  projectWrapperPath: path.resolve(basePath, 'projects', 'components-wrapper'),
  data: require('./data.json')
};

const projectWrapperAppModulePath = path.resolve(configs.projectWrapperPath, `src`, `app`, 'app.module.ts');
const projectWrapperAppModuleTemplatePath = path.resolve(configs.projectWrapperPath, `src`, `app`, 'app.module.ts.template');

module.exports = {
  configs,
  basePath,
  projectWrapperAppModulePath,
  projectWrapperAppModuleTemplatePath
};