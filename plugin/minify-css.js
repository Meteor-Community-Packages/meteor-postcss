// Makes sure we can load peer dependencies from app's directory.
// See: https://github.com/juliancwirko/meteor-postcss/issues/15
//      https://github.com/meteor/meteor/issues/10827
Npm.require('app-module-path/cwd');

import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import Future from 'fibers/future';
import sourcemap from 'source-map';
import { createHash } from "crypto";
import micromatch from 'micromatch';
import LRU from 'lru-cache';
import { performance } from 'perf_hooks';

checkNpmVersions({
    'postcss': '8.3.x',
    'postcss-load-config': '3.1.x'
}, 'juliancwirko:postcss');

const DEBUG_CACHE = process.env.DEBUG_METEOR_POSTCSS_CACHE === 'true';

var fs = Plugin.fs;
var path = Plugin.path;

Plugin.registerMinifier({
    extensions: ['css']
}, function () {
    const minifier = new CssToolsMinifier();
    return minifier;
});

var loaded = false;
var postcssConfigPlugins = [];
var postcssConfigParser = null;
var postcssConfigExcludedPackages = [];

var loadPostcssConfig = function () {
    if (!loaded) {
        loaded = true;

        var config;
        try {
            const load = require('postcss-load-config');
            config = Promise.await(load({meteor: true}));
            postcssConfigPlugins = config.plugins || [];
            postcssConfigParser = config.options.parser || null;
            postcssConfigExcludedPackages = config.options.excludedPackages || [];
            // There is also "config.file" which is a path to the file we use to force
            // Meteor reload on any change, but it seems this is not (yet) possible.
        }
        catch (error) {
            // Do not emit an error if the error is that no config can be found.
            if (error.message.indexOf('No PostCSS Config found') < 0) {
                throw error;
            }
        }
    }
};

var isNotInExcludedPackages = function (excludedPackages, pathInBundle) {
    let processedPackageName;
    let exclArr = [];
    if (excludedPackages && excludedPackages instanceof Array) {
        exclArr = excludedPackages.map(packageName => {
            processedPackageName = packageName && packageName.replace(':', '_');
            return pathInBundle && pathInBundle.indexOf('packages/' + processedPackageName) > -1;
        });
    }
    return exclArr.indexOf(true) === -1;
};

var isNotImport = function (inputFileUrl) {
    return !(/\.import\.css$/.test(inputFileUrl) ||
            /(?:^|\/)imports\//.test(inputFileUrl));
};

var watchAndHashDeps = Profile('watchAndHashDeps', function (deps, file) {
    const hash = createHash('sha1');
    const globsByDir = Object.create(null);
    let fileCount = 0;
    let folderCount = 0;
    let start = performance.now();

    deps.forEach(dep => {
        if (dep.type === 'dependency') {
            fileCount += 1;
            const fileHash = file.readAndWatchFileWithHash(dep.file, { cache: true }).hash;
            hash.update(fileHash).update('\0');
        } else if (dep.type === 'dir-dependency') {
            if (dep.dir in globsByDir) {
                globsByDir[dep.dir].push(dep.glob || '**');
            } else {
                globsByDir[dep.dir] = [dep.glob || '**'];
            }
        }
    });


    Object.entries(globsByDir).forEach(([ parentDir, globs ]) => {
        const matchers = globs.map(glob => micromatch.matcher(glob));

        function walk(dir) {
            folderCount += 1;
            hash.update(dir).update('\0');

            const entries = fs.readdirWithTypesSync(dir);
            for (const entry of entries) {
                const absPath = path.join(dir, entry.name);

                if (entry.isFile() && matchers.some(isMatch => isMatch(absPath))) {
                    fileCount += 1;
                    hash.update(file.readAndWatchFileWithHash(absPath, { cache: true }).hash).update('\0');
                } else if (
                    entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.meteor'
                ) {
                    walk(absPath);
                }
            }
        }

        walk(parentDir);
    });

    let digest = hash.digest('hex');

    if (DEBUG_CACHE) {
        console.log('--- PostCSS Cache Info ---');
        console.log('Glob deps', JSON.stringify(globsByDir, null, 2));
        console.log('File dep count', fileCount);
        console.log('Walked folders', folderCount);
        console.log('Created dep cache key in', performance.now() - start, 'ms');
        console.log('--------------------------');
    }

    return digest;
});

const createCacheKey = Profile("createCacheKey", function (files, mode) {
    const hash = createHash("sha1");
    hash.update(mode).update("\0");
    files.forEach(f => {
        hash.update(f.getSourceHash()).update("\0");
    });
    return hash.digest("hex");
});

function CssToolsMinifier() {
    this.mergeCache = new LRU({
        max: 100
    });
};

CssToolsMinifier.prototype.processFilesForBundle = function (files, options) {
    loadPostcssConfig();

    var mode = options.minifyMode;

    if (!files.length) return;

    var filesToMerge = [];

    files.forEach(function (file) {
        if (isNotImport(file._source.url)) {
            filesToMerge.push(file);
        }
    });

    const cacheKey = createCacheKey(filesToMerge, mode);
    let merged = this.mergeCache.get(cacheKey);

    if (
        !merged || merged.depsCacheKey !== watchAndHashDeps(merged.deps, files[0])
    ) {
        DEBUG_CACHE && console.log('PostCSS - not cached');

        merged = mergeCss(filesToMerge);
        this.mergeCache.set(cacheKey, {
            ...merged,
            depsCacheKey: watchAndHashDeps(merged.deps, files[0])
        });
    } else if (DEBUG_CACHE) {
        console.log('PostCSS - using cached result');
    }

    if (mode === 'development') {
        files[0].addStylesheet({
            data: merged.code,
            sourceMap: merged.sourceMap,
            path: 'merged-stylesheets.css'
        });
        return;
    }

    var minifiedFiles = CssTools.minifyCss(merged.code);

    if (files.length) {
        minifiedFiles.forEach(function (minified) {
            files[0].addStylesheet({
                data: minified
            });
        });
    }
};

// Lints CSS files and merges them into one file, fixing up source maps and
// pulling any @import directives up to the top since the CSS spec does not
// allow them to appear in the middle of a file.
var mergeCss = function (css) {
    // Filenames passed to AST manipulator mapped to their original files
    var originals = {};
    var postCSS = require('postcss');
    var deps = [];

    var cssAsts = css.map(function (file) {
        var filename = file.getPathInBundle();
        originals[filename] = file;

        var f = new Future;

        var css;
        var postres;
        var isFileForPostCSS;

        if (isNotInExcludedPackages(postcssConfigExcludedPackages, file.getPathInBundle())) {
            isFileForPostCSS = true;
        } else {
            isFileForPostCSS = false;
        }

        postCSS(isFileForPostCSS ? postcssConfigPlugins : [])
            .process(file.getContentsAsString(), {
                from: process.cwd() + file._source.url?.replace('/__cordova', ''),
                parser: postcssConfigParser
            })
            .then(function (result) {
                result.warnings().forEach(function (warn) {
                    process.stderr.write(warn.toString());
                });
                f.return(result);
            })
            .catch(function (error) {
                var errMsg = error.message;
                if (error.name === 'CssSyntaxError') {
                    errMsg = error.message + '\n\n' + 'Css Syntax Error.' + '\n\n' + error.message + error.showSourceCode()
                }
                error.message = errMsg;
                f.return(error);
            });

        try {
            var parseOptions = {
                source: filename,
                position: true
            };

            postres = f.wait();

            if (postres.name === 'CssSyntaxError') {
                throw postres;
            }

            if (postres.messages) {
                postres.messages.forEach(message => {
                    if (
                        message.type === 'dependency' ||
                        message.type === 'dir-dependency'
                    ) {
                        deps.push(message);
                    }
                });
            }

            css = postres.css;

            var ast = CssTools.parseCss(css, parseOptions);
            ast.filename = filename;
        } catch (e) {

            if (e.name === 'CssSyntaxError') {
                file.error({
                    message: e.message,
                    line: e.line,
                    column: e.column
                });
            } else if (e.reason) {
                file.error({
                    message: e.reason,
                    line: e.line,
                    column: e.column
                });
            } else {
                // Just in case it's not the normal error the library makes.
                file.error({
                    message: e.message
                });
            }

            return {
                type: "stylesheet",
                stylesheet: {
                    rules: []
                },
                filename: filename
            };
        }

        return ast;
    });

    var warnCb = function (filename, msg) {
        // XXX make this a buildmessage.warning call rather than a random log.
        //     this API would be like buildmessage.error, but wouldn't cause
        //     the build to fail.
        console.log(filename + ': warn: ' + msg);
    };

    var mergedCssAst = CssTools.mergeCssAsts(cssAsts, warnCb);

    // Overwrite the CSS files list with the new concatenated file
    var stringifiedCss = CssTools.stringifyCss(mergedCssAst, {
        sourcemap: true,
        // don't try to read the referenced sourcemaps from the input
        inputSourcemaps: false
    });

    if (!stringifiedCss.code) {
        return {
            code: '',
            deps
        };
    }

    // Add the contents of the input files to the source map of the new file
    stringifiedCss.map.sourcesContent =
        stringifiedCss.map.sources.map(function (filename) {
            return originals[filename].getContentsAsString();
        });

    // If any input files had source maps, apply them.
    // Ex.: less -> css source map should be composed with css -> css source map
    var newMap = sourcemap.SourceMapGenerator.fromSourceMap(
        new sourcemap.SourceMapConsumer(stringifiedCss.map));

    Object.keys(originals).forEach(function (name) {
        var file = originals[name];
        if (!file.getSourceMap())
            return;
        try {
            newMap.applySourceMap(
                new sourcemap.SourceMapConsumer(file.getSourceMap()), name);
        } catch (err) {
            // If we can't apply the source map, silently drop it.
            //
            // XXX This is here because there are some less files that
            // produce source maps that throw when consumed. We should
            // figure out exactly why and fix it, but this will do for now.
        }
    });

    return {
        code: stringifiedCss.code,
        sourceMap: newMap.toString(),
        deps
    };
};
