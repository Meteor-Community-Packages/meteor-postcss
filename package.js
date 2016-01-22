Package.describe({
    summary: 'Minifiers for Meteor with PostCSS processing - use Autoprefixer and others with ease',
    version: '1.0.0-beta.1',
    name: 'juliancwirko:postcss',
    git: 'https://github.com/juliancwirko/meteor-postcss.git'
});

Package.registerBuildPlugin({
    name: 'minifiers-postcss',
    use: [
        'ecmascript@0.3.1-modules.4',
        'minifiers-css@1.1.8-modules.4'
    ],
    npmDependencies: {
        'source-map': '0.5.3',
        'postcss': '5.0.14',
        'app-module-path': '1.0.5'
    },
    sources: [
        'plugin/minify-css.js'
    ]
});

Package.onUse(function(api) {
    api.use('isobuild:minifier-plugin@1.0.0');
});

Package.onTest(function(api) {

});
