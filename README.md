## Use PostCSS with Meteor - Package

(WIP package - experiments and questions)

### Questions

1. How to hook PostCSS to `.css` extension in Meteor build plugin? It will be cool if we could use for example Stylus as an separated build plugin and then PostCSS on generated css.
2. How to load custom PostCSS plugins without changing the main PostCSS build plugin file?

Here is what I've got till now:

### Usage

#### 1. Add the PostCSS package:

```
$ meteor add juliancwirko:postcss
```

#### 2. Add PostCSS plugins:

1. Create local package in the /packages folder - name it as you want
2. Inside the `package.js` file define Npm packages which are PostCSS's plugins. Example of package.js file:

```
Package.describe({
    summary: 'PostCSS default plugins set',
    version: '0.0.1',
    name: 'juliancwirko:postcss-plugins',
    git: ''
});

Npm.depends({
    'autoprefixer': '6.0.3',
    'rucksack-css': '0.8.5',
    'postcss-nested': '1.0.0',
    'postcss-import': '7.1.0',
    'postcss-simple-vars': '1.0.1'
});

```
This is all what you need in this Meteor package. Now add the new created package:
```
$ meteor add juliancwirko:postcss-plugins
```

#### 3. Create config file `postcss.json` in the root app folder. Example of config file:

```
{
    "plugins": [{
            "name": "postcss-import",
            "options": {},
            "dirName": "juliancwirko:postcss-plugins"
        }, {
            "name": "autoprefixer",
            "options": {},
            "dirName": "juliancwirko:postcss-plugins"
        }, {
            "name": "rucksack-css",
            "options": {},
            "dirName": "juliancwirko:postcss-plugins"
        }, {
            "name": "postcss-nested",
            "options": {},
            "dirName": "juliancwirko:postcss-plugins"
        }, {
            "name": "postcss-simple-vars",
            "options": {},
            "dirName": "juliancwirko:postcss-plugins"
        }
    ]
}
```
Explanation:

- `name` - PostCSS plugin name needed in PostCSS plugins API inside the build plugin (this is dynamic so we need to pass it somewhere)
- `options` - PostCSS plugins has options which you can pass. Like for example Autoprefixer
```
Npm.require("autoprefixer")({add: false, browsers: []});
```
- `dirName` - we need to point where are node_modules folders, we need to pass local package folder name here

#### 4. Create your first `.pcss` files. Yes `.pcss`, unfortunately we can't use `.css` extension here :/


### Sum up

1. Can we do this simpler. Is there a way to customize our Meteor build plugins by adding new npm packages from outside the package?

2. I think that the Build Plugins API in Meteor should be better documented :/

3. I realy want to use `.css` extension :/

### Demo test repo

- [https://github.com/juliancwirko/meteor-postcss-test](https://github.com/juliancwirko/meteor-postcss-test)
- [Discussion and updates](https://forums.meteor.com/t/postcss-package-and-meteor-build-plugin-questions/12454?u=juliancwirko)

### Todo

- hook all into Meteor minifiers with .css extension