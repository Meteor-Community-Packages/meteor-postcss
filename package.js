Package.describe({
    summary: 'PostCSS with Meteor',
    version: '0.0.2',
    name: 'juliancwirko:postcss',
    git: 'https://github.com/juliancwirko/meteor-postcss.git'
});

Package.registerBuildPlugin({
    name: 'compilePostCSS',
    use: ['ecmascript@0.1.6', 'caching-compiler@1.0.0'],
    sources: [
        'plugin/compile-postcss.js'
    ],
    npmDependencies: {
        'postcss': '5.0.10',
        'es6-promise': '3.0.2',
        'app-module-path': '1.0.4'
    }
});

Package.onUse(function(api) {
    api.use('isobuild:compiler-plugin@1.0.0');
});
