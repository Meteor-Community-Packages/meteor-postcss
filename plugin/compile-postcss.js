Npm.require('es6-promise').polyfill();

const appModulePath = Npm.require('app-module-path');
appModulePath.addPath(process.cwd() + '/packages');

const Future = Npm.require('fibers/future');
const fs = Plugin.fs;
const path = Plugin.path;
const postCSS = Npm.require('postcss');

Plugin.registerCompiler({
  extensions: ['pcss'],
  archMatching: 'web'
}, () => new PostCSSCompiler());

const CONFIG_FILE_NAME = 'postcss.json';

const projectOptionsFile = path.resolve(process.cwd(), CONFIG_FILE_NAME);

let loadJSONFile = function (filePath) {
  let content = fs.readFileSync(filePath);
  try {
      return JSON.parse(content);
  } catch (e) {
      console.log('Error: failed to parse ', filePath, ' as JSON');
      return {};
  }
};

let configOptions = {};

if (fs.existsSync(projectOptionsFile)) {
  configOptions = loadJSONFile(projectOptionsFile);
}

let getPostCSSPlugins = function () {
  let plugins = [];
  if (configOptions) {
    configOptions.plugins.forEach(function (pluginObj) {
      plugins.push(Npm.require(pluginObj.dirName + '/.npm/package/node_modules/' + pluginObj.name)(pluginObj.options));
    });
  }
  return plugins;
};

// CompileResult is {css}.
class PostCSSCompiler extends MultiFileCachingCompiler {
  constructor() {
    super({
      compilerName: 'postCSS',
      defaultCacheSize: 1024*1024*10,
    });
  }

  getCacheKey(inputFile) {
    return inputFile.getSourceHash();
  }

  compileResultSize(compileResult) {
    return compileResult.css.length +
      this.sourceMapSize(compileResult.sourceMap);
  }

  isRoot(inputFile) {
    const fileOptions = inputFile.getFileOptions();
    if (fileOptions.hasOwnProperty('isImport')) {
      return !fileOptions.isImport;
    }

    const pathInPackage = inputFile.getPathInPackage();
    return !(/\.import\.pcss$/.test(pathInPackage) ||
             /(?:^|\/)imports\//.test(pathInPackage));
  }

  compileOneFile(inputFile, allFiles) {

    let referencedImportPaths = [];

    allFiles.forEach(function (file) {
      let filePath = file.getPathInPackage();
      let ifIsPackageName = function () {
        if (file.packageName) {
          return file.packageName;
        }
        return '';
      }
      if (/\.import\.pcss$/.test(filePath)) {
        referencedImportPaths.push('{' + ifIsPackageName() + '}/' + filePath);
      }
    });

    const f = new Future;

    let css;
    let postres;

    postCSS(getPostCSSPlugins())
    .process(inputFile.getContentsAsString(), {
      from: inputFile.getPathInPackage(),
      map: true
    }).then(function (result) {
      f.return(result);
    });

    try {
      postres = f.wait();
      css = postres.css;
    } catch (e) {
      inputFile.error({
        message: 'PostCSS compiler error: ' + e.message
      });
      return null;
    }

    return {referencedImportPaths, compileResult: {css}};
  }

  addCompileResult(inputFile, {css}) {
    inputFile.addStylesheet({
      path: inputFile.getPathInPackage() + '.css',
      data: css
    });
  }
}