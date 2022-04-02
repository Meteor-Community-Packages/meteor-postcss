Package.describe({
  summary: 'Minifier for Meteor with PostCSS processing - use Autoprefixer and others with ease',
  version: '2.1.0',
  name: 'juliancwirko:postcss',
  git: 'https://github.com/juliancwirko/meteor-postcss.git'
});

Package.registerBuildPlugin({
  name: 'minifier-postcss',
  use: [
    'ecmascript@0.15.3',
    'minifier-css@1.6.0',
    'tmeasday:check-npm-versions@1.0.2'
  ],
  npmDependencies: {
    'source-map': '0.5.6',
    'app-module-path': '2.2.0',
    'lru-cache': '6.0.0',
    'micromatch': '4.0.4'
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
