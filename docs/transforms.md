# Transforms

While many frameworks and tools require you to install and configure plugins to transform assets, Parcel Prototyper provides support for many common transformers, pre-processors, and transpilers out of the box.

This allows you to do things like:

- Transform and transpile JavaScript using Babel
- Pre-process and transform HTML using PostHTML
- Pre-process CSS using SCSS, Less, and Stylus
- Control your browser support using browerslist
- And more!

## JavaScript

Parcel Prototyper allows you to write modern ES6 JavaScript and automatically transpiles it to browser-friendly code using Babel.

It supports this for JavaScript assets, as well as inline JavaScript in your HTML assets.

By default, your code is transpiled using `@babel/preset-env`, and targets browsers that have `> 0.25%` usage.

### Configuring Babel

You can also configure babel to do any other kind of transform that babel supports by adding a babel configuration file to the root of your project.

For example, to add React support first install the babel preset:

Yarn:

```
yarn add @babel/preset-react
```

NPM:

```
npm install @babel/preset-react --save
```

Create a `.babelrc` at the root of your project, and add the preset:

```
{
    "presets": ["@babel/preset-react"]
}
```

For more information on Babel, see their [documentation](TODO: link).

## HTML

Parcel Prototyper allows you to transform all HTML assets using PostHTML.

To do so, add a PostHTML configuration to the root of your prototype with your desired configuration.

For example, to add support for markdown in your HTML, first install the `posthtml-md` plugin:

Yarn:

```
yarn add posthtml-md
```

NPM:

```
npm install posthtml-md --save
```

Then add a `.posthtmlrc` to the root of your prototype with the following:

```
{
    "plugins": {
        "posthtml-md": {
            "root": "src/assets"
        }
    }
}
```

Now you can transform the text content of any element with markdown by adding an `md` attribute:

```
<div md>
  *I will be emphasized*
  **I will be bolded**
</div>
```

## CSS

Parcel Prototyper allows you to transform all CSS assets using PostCSS.

To do so, add a PostCSS configuration to the root of your prototype with your desired configuration.

For example, to automatically add vendor prefixes to your CSS using Autoprefixer first install Autoprefixer:

Yarn:

```
yarn add autoprefixer
```

NPM:

```
npm install autoprefixer --save
```

Then add `.postcssrc` to the root of your prototype with the following:

```
{
    "plugins": {
        "autoprefixer": {}
    }
}
```

For more information on what PostCSS can do, see their [documentation](TODO: link)

