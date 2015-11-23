Package.describe({
    summary: 'Minifiers for Meteor with PostCSS processing - use Autoprefixer and others with ease',
    version: '0.2.3',
    name: 'juliancwirko:postcss',
    git: 'https://github.com/juliancwirko/meteor-postcss.git'
});

Package.registerBuildPlugin({
    name: 'minifiers-postcss',
    use: [
        'ecmascript@0.1.6',
        'minifiers@1.1.7'
    ],
    npmDependencies: {
        'source-map': '0.5.3',
        'postcss': '5.0.12',
        'es6-promise': '3.0.2',
        'app-module-path': '1.0.4'
    },
    sources: [
        'plugin/minify-js.js',
        'plugin/minify-css.js'
    ]
});

Package.onUse(function(api) {
    api.use('meteorhacks:npm@1.5.0', ['client']);
    api.use('isobuild:minifier-plugin@1.0.0');
});

Package.onTest(function(api) {

});