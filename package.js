Package.describe({
    summary: 'Minifier for Meteor with PostCSS processing - use Autoprefixer and others with ease',
    version: '1.2.0',
    name: 'juliancwirko:postcss',
    git: 'https://github.com/juliancwirko/meteor-postcss.git'
});

Package.registerBuildPlugin({
    name: 'minifier-postcss',
    use: [
        'ecmascript@0.5.9',
        'minifier-css@1.2.15'
    ],
    npmDependencies: {
        'source-map': '0.5.6',
        'postcss': '5.2.5',
        'app-module-path': '2.1.0'
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
