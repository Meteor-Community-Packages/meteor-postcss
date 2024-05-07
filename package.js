Package.describe({
  summary: 'Minifier for Meteor with PostCSS processing - use Autoprefixer and others with ease',
  version: '3.0.0-alpha.19',
  name: 'juliancwirko:postcss',
  git: 'https://github.com/juliancwirko/meteor-postcss.git'
});

Package.registerBuildPlugin({
  name: 'minifier-postcss',
  use: [
    'ecmascript@0.15.2',
    'minifier-css@1.5.4 || 2.0.0-alpha300.19',
    'tmeasday:check-npm-versions@1.0.2'
  ],
  npmDependencies: {
    'source-map': '0.5.6',
    'app-module-path': '2.2.0'
  },
  sources: [
    'plugin/minify-css.js'
  ]
});

Package.onUse(function (api) {
  api.use('isobuild:minifier-plugin@1.0.0');
});

Package.onTest(function (api) {

});
