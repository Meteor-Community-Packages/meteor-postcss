## Use PostCSS with Meteor - Package

Meteor CSS Minifiers with [PostCSS](https://github.com/postcss/postcss) processing.

**Version 1.0.0 is for Meteor 1.3 and above. For older Meteor versions you can use 0.2.5.**

This package allows you to use PostCSS plugins with **.css files**. You can add your custom plugins by adding Npm packages using `package.json`. You can also use your favourite preprocessor side by side with this package. It allows you to enable many PostCSS plugins, for example **Autoprefixer** for all preprocessors you use. (Of course you can use it whithout any preprocessor too).

Read more below...

- Blog post: [How to use PostCSS in Meteor](http://julian.io/how-to-use-postcss-in-meteor/)
- Blog post: [How to use CSS linter in Meteor](https://medium.com/@juliancwirko/how-to-use-css-linter-in-meteor-c60b2f24f969) (example of PostCSS plugin usage)

### Usage

#### 1. Remove `standard-minifiers` package

```
$ meteor remove standard-minifiers
```

#### 2. Add `juliancwirko:postcss` and also `standard-minifiers-js` package

```
$ meteor add juliancwirko:postcss
$ meteor add standard-minifiers-js
```
We need to add `standard-minifiers-js` because we have removed `standard-minifiers` package.
Don't worry, you will get standard-minifiers-css with PostCSS porcessing minifier.

#### 3. Add PostCSS plugins:

From Meteor 1.3 you can use standard NPM `package.json`. You can add PostCSS plugins in `devDependencies`.

**package.json (PostCSS plugins):**
```
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "autoprefixer": "6.1.2"
  },
}
```

**(Order here is important. For example 'postcss-import' should be always first PostCSS plugin on the list and 'autoprefixer' should be the last PostCSS plugin on the list.)**

PostCSS will know which Npm packages are PostCSS plugins and which aren't.

Remember to run `npm install` or `npm update` after changes.

#### 4. If you need to pass some options to your PostCSS plugins create `postcss` key in `package.json`

Example of options file (Example: we have some plugins but we need to pass options only for autoprefixer):

**package.json (PostCSS plugins options - this file is optional):**
```
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "postcss-import": "7.1.3",
    "postcss-nested": "1.0.0",
    "postcss-simple-vars": "1.2.0",
    "rucksack-css": "0.8.5",
    "autoprefixer": "6.3.1"
  },
  "postcss": {
    "pluginsOptions": {
      "postcss-import": {},
      "postcss-nested": {},
      "postcss-simple-vars": {},
      "rucksack-css": {},
      "autoprefixer": {"browsers": ["last 2 versions"]}
    }
  }
}
```

You can add more plugins here.

If you want to change something in postcss config later, you should restart your app and also change any .css file to rerun build plugin.

#### 5. Create your standard `.css` files with additional features according to PostCSS plugins you use.

### Imports with PostCSS

You can use imports with [postcss-import](https://github.com/postcss/postcss-import) plugin. Although I need to do more tests on this one. For the demo app it works. Also we need to test other PostCSS plugins. **Remember that postcss-import plugin should be loaded first (so put it on the first place in the packages.json file)**.

You need to use `.import.css` extension and standard import like with preprocessors `@import "my-file.import.css";` Files with `.import.css` will be ommited by css minifier from this package.

### Usage with preprocessors like Stylus and Sass

You can use it side by side with your favourite preprocessor. There is an example in the demo app.

You should be able to use PostCSS plugins syntax in the .styl or .scss files too. (Tested only with Stylus).

### Demo test repo

- [https://github.com/juliancwirko/meteor-postcss-test](https://github.com/juliancwirko/meteor-postcss-test)
- [Discussion and updates](https://forums.meteor.com/t/postcss-package-and-meteor-build-plugin-questions/12454?u=juliancwirko)

### License

MIT

### TODO

- tests
- PR and ideas are welcomed.

### Also check out:

- [sGrid - Flexbox Grid System for Stylus with PostCSS](https://atmospherejs.com/juliancwirko/s-grid)

### Changelog

- v1.0.0 Modifications for Meteor 1.3
- v0.2.5 Removed Promise Polyfill [#4](https://github.com/juliancwirko/meteor-postcss/pull/4)
- v0.2.4 Catch PostCSS 'CssSyntaxError' [#3](https://github.com/juliancwirko/meteor-postcss/issues/3)
- v0.2.3 PostCSS (v5.0.12) version bump
- v0.2.2 PostCSS (v5.0.11) version bump - [performance improvements](https://evilmartians.com/chronicles/postcss-1_5x-faster)
