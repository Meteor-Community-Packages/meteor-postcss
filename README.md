
#### Important! Package is no longer actively maintained. I am not sure if it will work with newest Meteor versions. If you think you can keep it in good shape, let me know. I'll pass it to you. Thanks.

From version 2.0.0 it uses [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config). Thanks to [@mitar](https://github.com/mitar). For more info check: [#32](https://github.com/juliancwirko/meteor-postcss/pull/32).

## Use PostCSS with Meteor - Package

Meteor CSS Minifier with [PostCSS](https://github.com/postcss/postcss) processing.

- - -

It seems that this package works quite well with Meteor 1.4.2, but because of Meteor's build system nature it might be hard to use it with many different PostCSS plugins. If you can and want to help, it would be very appreciated. Thanks!
Check out all issues before you use it. If you need it only for Autoprefixer it should work well. I can't guarantee that all PostCSS's plugins will work.

- - -


Version 1.1.1 is for Meteor 1.3.*. For older Meteor versions you can use 0.2.5

This package allows you to use PostCSS plugins with **.css files**. You can add your custom plugins by adding Npm packages using `package.json`. You can also use your favourite preprocessor side by side with this package. It allows you to enable many PostCSS plugins, for example **Autoprefixer** for all preprocessors you use. (Of course you can use it whithout any preprocessor too).

Read more below...

- Blog post: [Some things you may think about PostCSS... and you might be wrong](http://julian.io/some-things-you-may-think-about-postcss-and-you-might-be-wrong/)
- Blog post: [How to use PostCSS in Meteor](http://julian.io/how-to-use-postcss-in-meteor/)
- Blog post: [How to use CSS linter in Meteor](https://medium.com/@juliancwirko/how-to-use-css-linter-in-meteor-c60b2f24f969) (example of PostCSS plugin usage)

### Usage

#### 1. Remove `standard-minifier-css` package

```
$ meteor remove standard-minifier-css
```

#### 2. Add `juliancwirko:postcss` package

```
$ meteor add juliancwirko:postcss
```

#### 3. Add peer NPM dependencies

```
$ meteor npm install --save-dev postcss@6.0.22 postcss-load-config@1.2.0
```

#### 4. Add PostCSS plugins:

From Meteor 1.3 you can use standard NPM `package.json`. You can add PostCSS plugins in `devDependencies`. You can also install it like `npm install autoprefixer --save-dev`.

Then you need to prepare PostCSS configuration under the `postcss.plugins`.

**Important:** Even if you don't want to provide any options you should list your PostCSS plugins in `postcss.plugins` key. This works that way because order here is important. For example 'postcss-easy-import' should be always first PostCSS plugin on the list and 'autoprefixer' should be the last PostCSS plugin on the list. And devDependencies items can be automatically reordered when installing new by `npm install ... --save-dev`.

See example:

**package.json (example):**
```
{
  "name": "demo PostCSS app",
  "version": "1.0.0",
  "description": "",
  "author": "",
  "devDependencies": {
    "autoprefixer": "^6.5.1",
    "mocha": "^3.1.2",
    "postcss": "^6.0.22",
    "postcss-easy-import": "^1.0.1",
    "postcss-load-config": "^1.2.0",
    "postcss-nested": "^1.0.0",
    "postcss-simple-vars": "^3.0.0",
    "rucksack-css": "^0.8.6"
  },
  "postcss": {
    "plugins": {
      "postcss-easy-import": {},
      "postcss-nested": {},
      "postcss-simple-vars": {},
      "rucksack-css": {},
      "autoprefixer": {"browsers": ["last 2 versions"]}
    }
  }
}
```

Make sure that the plugins that you list in "plugins" are also in "devDependencies" as well. You may not need the plugins in this example, so please include them only if you need them.

Remember to run `npm install` or `npm update` after changes.

You can add more plugins here.

If you want to change something in postcss config later, you should restart your app and also change any .css file to rerun build plugin.

#### 5. Create your standard `.css` files with additional features according to PostCSS plugins you use.

### PostCSS parsers

From version 1.0.0 you can configure parser for PostCSS. To do this you can add `parser` key in the `package.json` file under the `postcss` key. Let's see an example:

```
{
  "name": "demo PostCSS app",
  "version": "1.0.0",
  "description": "",
  "author": "",
  "devDependencies": {
    "autoprefixer": "^6.5.1",
    "postcss-safe-parser": "^2.0.0"
  },
  "postcss": {
    "plugins": {
      "autoprefixer": {"browsers": ["last 2 versions"]}
    },
    "parser": "postcss-safe-parser"
  }
}
```

As you can see we use here `postcss-safe-parser` which will repair broken css syntax. This is just one example. You can find a list of parsers here: [https://github.com/postcss/postcss#syntaxes](https://github.com/postcss/postcss#syntaxes). You can use `postcss-scss` parser or `postcss-less` parser.

### Exclude Meteor Packages

Because PostCSS processes all CSS files in Meteor, it will also process CSS files from Meteor packages. This is good in most cases and will not break anything, but sometimes it could be problematic.

If you have installed a package which is problematic and PostCSS plugins can't process the CSS files from that package you can exclude it in the process. See for example this issue: [#14](https://github.com/juliancwirko/meteor-postcss/issues/14). In this case you need to exclude `constellation:console` package because it uses not standard CSS in its files. PostCSS plugin can't process that file. You can exclude it so it will be not processed by PostCSS, but it will be still bundled as is.

If you want to exclude a package you need to use `postcss.excludedPackages` key, see the example below:

```
{
  "name": "demo PostCSS app",
  "version": "1.0.0",
  "description": "",
  "author": "",
  "devDependencies": {
    "autoprefixer": "^6.5.1",
    "postcss-safe-parser": "^2.0.0"
  },
  "postcss": {
    "plugins": {
      "autoprefixer": {"browsers": ["last 2 versions"]}
    },
    "parser": "postcss-safe-parser",
    "excludedPackages": ["constellation:console"]
  }
}
```

**Remember that you should provide a package name which contains a problematic CSS file and not global wrapper package** In this example you want to install `babrahams:constellation` but in fact the problematic package is `constellation:console` which is installed with `babrahams:constellation`. You'll find which package makes troubles by looking into the consolle errors. For example here we have something like:

```
While minifying app stylesheet:
   packages/constellation_console/client/Constellation.css:118:3: postcss-simple-vars:
   /workspace/meteor/postcss-demo/packages/constellation_console/client/Constellation.css:118:3: Undefined variable $c1

   Css Syntax Error.

   postcss-simple-vars: /workspace/meteor/postcss-demo/packages/constellation_console/client/Constellation.css:118:3: Undefined variable $c1
   background-image: -o-linear-gradient(#000, #000);
   filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='$c1', endColorstr='$c2',GradientType=0);
   ^
   color: rgba(255, 255, 255, 0.6);
```

So we know that this is the problem with `constellation:console` package.

### Imports with PostCSS

You can use imports with [postcss-easy-import](https://github.com/postcss/postcss-easy-import) plugin. **Remember that postcss-easy-import plugin should be loaded first (so put it on the first place in the packages.json file under the 'postcss.plugins' key)**.

You need to use `.import.css` extension and standard import like with preprocessors `@import "my-file.import.css";` Files with `.import.css` will be ommited by css minifier from this package. You can also put them in an `imports` folder (from Meteor 1.3). Also read more about `postcss-easy-import` and `postcss-import` which is a part of the first one.

Imports from Meteor packages will not work. But there is a good news too. from Meteor 1.3 you can use standard Npm packages and imports from `node_modules` should work. So you will be able to import css files from instaled Npm packages. You will be able to do something like: `@import 'my-npm-lib/styles.css'`;

### Usage with preprocessors like Stylus and Sass

You can use it side by side with your favourite preprocessor. There is an example in the demo app.

You should be able to use PostCSS plugins syntax in the .styl or .scss files too. (Tested only with Stylus).

### Alternative configuration locations

This package uses [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config) to load
configuration for PostCSS. This allows you to put PostCSS configuration into alternative locations and not
just `package.json`. An interesting option is to put configuration into `.postcssrc.js` file in the root
directory of your app, which allows you to dynamically decide on the configuration. Example:

```js
module.exports = (ctx) => {
  // This flag is set when loading configuration by this package.
  if (ctx.meteor) {
    const config = {
      plugins: {
        'postcss-easy-import': {},
      },
    };

    if (ctx.env === 'production') {
      // "autoprefixer" is reported to be slow,
      // so we use it only in production.
      config.plugins.autoprefixer = {
        browsers: [
          'last 2 versions',
        ],
      };
    }

    return config;
  }
  else {
    return {};
  }
};
```

### Demo test repo

Check out the demo repo. This is the best way of learning.

- [https://github.com/juliancwirko/meteor-postcss-test](https://github.com/juliancwirko/meteor-postcss-test)
- [Discussion and updates](https://forums.meteor.com/t/postcss-package-and-meteor-build-plugin-questions/12454?u=juliancwirko)

### Migration from older version

This package (in version 1.0.0) will work only with Meteor 1.3

If you want to migrate to version 1.0.0 you need to rid `meteorhacks:npm` package and also remove `npm-container` which is created by `meteorhacks:npm` you should remove it by `meteor remove meteorhacks:npm npm-container` you can also remove it from `packages` folder.

You need to remove `packages.json` (created by meteorhacks:npm) and `postcss.json` which you should have if you use postcss package.

For now everything is configured in one `package.json` file (read above) which is a standard Npm configuration file. From Meteor 1.3 you can use standard Npm config so this is the better approach.

Remember to move your all configuration entries from `packages.json` and `postcss.json` to `package.json` according the 'Usage' section of this docs.

**Remove the package by `meteor remove juliancwirko:postcss` and add it again `meteor add juliancwirko:postcss@1.0.0`** it should install current version.

Make sure that you have standard-minifier-js package installed, if not add it by `meteor add standard-minifier-js`. Also make sure that you don't have standard-minifier**s**-js package (there was a name change). In Meteor 1.3 there are 2 separate packages for css and js minifiers and the css one is included in juliancwirko:postcss. Previously there was also js minifier. Now it is removed so you need to add it by hand.

### License

MIT

### Also check out:

- [PostCSS and Bootstrap 4 with Scss from Npm package - experiment](https://github.com/juliancwirko/meteor-bootstrap-postcss-test)
- [sGrid - Flexbox Grid System for Stylus with PostCSS](https://atmospherejs.com/juliancwirko/s-grid)

### Changelog

- v2.0.3 Restoring the use of app-module-path
- v2.0.2 Moved to use peer NPM dependencies
- v2.0.1 Bumping PostCSS to 6.0.22
- v2.0.0 Started using postcss-load-config for loading configuration
- v1.3.0 Bumping PostCSS to 6.0.17
- v1.2.0 Updates (works quite well with Meteor 1.4.2)
- v1.1.1 Removed `fs.existsSync` call because of [#18](https://github.com/juliancwirko/meteor-postcss/issues/18)
- v1.1.0 Exclude Meteor package option [#14](https://github.com/juliancwirko/meteor-postcss/issues/14)
- v1.0.0 Version bump for Meteor 1.3
- v1.0.0-rc.12 Version bump for Meteor 1.3 rc 12
- v1.0.0-rc.10 Version bump for Meteor 1.3 rc 10
- v1.0.0-rc.4 Version bump for Meteor 1.3 rc 4
- v1.0.0-rc.2 Version bump for Meteor 1.3 rc 2
- v1.0.0-beta.11 Versions bump for Meteor 1.3 beta 11
- v1.0.0-beta.1 Modifications for Meteor 1.3 beta 4
- v0.2.5 Removed Promise Polyfill [#4](https://github.com/juliancwirko/meteor-postcss/pull/4)
- v0.2.4 Catch PostCSS 'CssSyntaxError' [#3](https://github.com/juliancwirko/meteor-postcss/issues/3)
- v0.2.3 PostCSS (v5.0.12) version bump
- v0.2.2 PostCSS (v5.0.11) version bump - [performance improvements](https://evilmartians.com/chronicles/postcss-1_5x-faster)
