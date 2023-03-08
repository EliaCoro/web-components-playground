const path = require('path');
const fs = require('fs');

const basePath = path.resolve(__dirname, `../`);

const libName = process.argv[2];
if (!libName) {
  throw new Error('Please provide a library name');
}

const angularConfigs = require(path.resolve(basePath, 'angular.json'));

if (!angularConfigs) {
  throw new Error('angular.json not found');
}

const angularConfigForProject = angularConfigs.projects[libName];

if (!angularConfigForProject) {
  throw new Error(`angular.json does not contain a project named ${libName}`);
}

const projectPath = path.resolve(basePath, angularConfigForProject.sourceRoot);

const publicApiPath = path.resolve(projectPath, 'public-api.ts');

if (!fs.existsSync(publicApiPath)) {
  throw new Error(`public-api.ts not found in ${projectPath}`);
}

const publicApiContent = fs.readFileSync(publicApiPath, 'utf8').replace(/\/\*(.*)\*\//gs, '').replace(/\n/g, '');
const filesToImport = publicApiContent.split('export * from \'./').filter((line) => line !== '').map((line) => line.replace('\'', '').replace(';', ''));

const fileContents = filesToImport.map((file) => {
  const filePath = path.resolve(projectPath, `${file}.ts`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} not found`);
  }

  return fs.readFileSync(filePath, 'utf8');
}).join("\n/* --end-of-file-- */\n").replace(/\n/gm, '');

const findAndAdd = (regex, array = []) => {
  let m;
  while ((m = regex.exec(fileContents)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        const classDeclarationStartIndex = fileContents.indexOf(match) + match.length + 1;
        const classDeclaration = fileContents.substring(classDeclarationStartIndex, classDeclarationStartIndex + 100).split(' ').slice(0, 3).join(' ');
        if (classDeclaration.indexOf('export class') === 0) array.push(classDeclaration.split(' ')[2]);
      }
    });
  }

  return array;
};

const components = findAndAdd(/@Component\(([\s\S]*?)\)/g);
const services = findAndAdd(/@Injectable\(([\s\S]*?)\)/g);
const modules = findAndAdd(/@NgModule\(([\s\S]*?)\)/g);

if (components.length === 0){
  console.error('No components found');
}

if (services.length === 0){
  console.warn('No services found');
}

if (modules.length === 0){
  console.error('No modules found');
}

if (modules.length > 1){
  console.error('More than one module found');
}

if (components.length > 1) {
  console.error('More than one component found');
}

const mainComponentPath = path.resolve(projectPath, `${filesToImport.filter(p => p.indexOf('.component') > 0)[0]}`);
const mainModulePath = path.resolve(projectPath, `${filesToImport.filter(p => p.indexOf('.module') > 0)[0]}`);
const mainServicePath = path.resolve(projectPath, `${filesToImport.filter(p => p.indexOf('.service') > 0)[0]}`);

const exportName = mainComponentPath.split('/').pop().replace('.ts', '').replace('.component', '');

const data = {
  Module: {
    klass: modules[0],
    path: mainModulePath
  },

  Component: {
    klass: components[0],
    path: mainComponentPath,
    exportName: exportName
  },
};

fs.writeFileSync(path.resolve(__dirname, 'data.json'), JSON.stringify(data, null, 2));
