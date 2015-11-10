## Use PostCSS with Meteor - Package

Meteor Minifiers with [PostCSS](https://github.com/postcss/postcss) processing.

This package allows you to use PostCSS plugins with **.css files**. You can add your custom plugins by adding Npm packages using meteorhacks:npm. You can also use your favourite preprocessor side by side with this package. It allows you to enable many PostCSS plugins, for example **Autoprefixer** for all preprocessors you use. (Of course you can use it whithout any preprocessor too).

Read more below...

- Blog post: [How to use PostCSS in Meteor](http://julian.io/how-to-use-postcss-in-meteor/)

### Usage

#### 1. Remove `standard-minifiers` package

```
$ meteor remove standard-minifiers
```

#### 2. Add `juliancwirko:postcss` package

```
$ meteor add juliancwirko:postcss
```

Don't worry, you will get standard js minifier and css with PostCSS porcessing minifier. For now there isn't any way in Meteor to replace only the css minifier so js minifier is just copied from `standard-minifiers` package. The css one is changed to allow PostCSS processing and all other stuff works the same (merge, minification etc.).

#### 3. Add PostCSS plugins:

This package uses [meteorhacks:npm](https://github.com/meteorhacks/npm) package for managing npm packages in Meteor. So if you add juliancwirko:postcss it will also add meteorhacks:npm. When you run your Meteor app there will be `packages.json` file created in the root of your app. You can specify PostCSS plugins there (standard npm packages). Example:

**packages.json (PostCSS plugins):**
```
{
    "postcss-import": "7.1.0",
    "postcss-nested": "1.0.0",
    "postcss-simple-vars": "1.0.1",
    "rucksack-css": "0.8.5",
    "autoprefixer": "6.0.3"
}
```

**(Order here is important. For example 'postcss-import' should be always first PostCSS plugin on the list and 'autoprefixer' should be the last PostCSS plugin on the list.)**

Restart your app.
Of course you can use `meteorhacks:npm` for other stuff.
PostCSS will know which Npm packages are PostCSS plugins and which aren't.

#### 4. If you need to pass some options to your PostCSS plugins create options file `postcss.json` in the root app folder.

Example of options file (Example: we have some plugins but we need to pass options only for autoprefixer):

**postcss.json (PostCSS plugins options - this file is optional):**
```
{
    "pluginsOptions": {
        "autoprefixer": {"browsers": ["last 2 versions"]}
    }
}
```

You can add more plugins here.

If you want to change something in postcss.json config file later, you should restart your app and also change any .css file to rerun build plugin.

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