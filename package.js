Package.describe({
    summary: 'Minifiers for Meteor with PostCSS processing',
    version: '0.1.0',
    name: 'juliancwirko:postcss',
    git: 'https://github.com/juliancwirko/meteor-postcss.git'
});

Package.registerBuildPlugin({
    name: 'minifiers-postcss',
    use: [
        'minifiers'
    ],
    npmDependencies: {
        'source-map': '0.4.2',
        'postcss': '5.0.10',
        'es6-promise': '3.0.2',
        'app-module-path': '1.0.4'
    },
    sources: [
        'plugin/minify-js.js',
        'plugin/minify-css.js'
    ]
});

Package.onUse(function(api) {
    api.use('isobuild:minifier-plugin@1.0.0');
});

Package.onTest(function(api) {

});