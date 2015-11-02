## Use PostCSS with Meteor - Package

Meteor Minifiers with [PostCSS](https://github.com/postcss/postcss) processing.
With this package you can use PostCSS plugins on .css files. You can add your custom plugins by adding local Meteor package. Read more below...

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
    "autoprefixer": "6.0.3",
    "rucksack-css": "0.8.5"
}
```

Restart your app.

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

#### 5. Create your standard `.css` files with additional features according to PostCSS plugins you use.

### Imports with PostCSS

You can use imports with [postcss-import](https://github.com/postcss/postcss-import) plugin. Although I need to do more tests on this one. For the demo app it works. Also we need to test other PostCSS plugins. **Remember that postcss-import plugin should be loaded first (in postcss.json)**.

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