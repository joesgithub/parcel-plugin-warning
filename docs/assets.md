# Assets

Parcel Prototyper works by analyzing your assets, or files. Parcel Prototyper can generally handle any type of file, but provides special functionality for certain file types like JavaScript, CSS, and HTML files.

For these asset types, Parcel Prototyper automatically analyzes the files and discovers all of the assets referenced in them and automatically bundles them for you.

Inside of `index.html`:

```
<!doctype html>
<html>
<body>
    <script src="./index.js"></script>
</body>
</html>
```

In `index.html`, we're referencing a JavaScript asset, `index.js`.

Assets that have different output filetypes are turned into child bundles, and are output in separate files. In this case, `index.js` will be turned into a child bundle and a separate file will be output for it.

Now, let's take a look at `index.js`:

```
const utils = require('./helloWorld.js);
const image = require('./picture.jpg');
```

In `index.js`, we're referencing a JavaScript asset, `helloWorld.js` and a JPG asset, `picture.jpg`.

Assets that have the same output filetype are grouped together in the same output bundle, so in this case both the contents of `index.js` and `utils.js` will be combined and a single file will be output with the contents of both.

Whereas `picture.jpg` has a different output filetype, so it will be output as a separate file.

The benefit of this is that you can split up your assets however you like, and they will be bundled, transformed, and updated in all of your assets for you in your prototype, making it as simple and performant as possible.

In the end, our prototype's file structure will something like:

```
|- index.html
|- index.js
|- picture.jpg
```

## Supported Asset Types

Parcel Prototyper supports all asset types supported by Parcel Bundler, such as:

- HTML
- CSS
- SCSS
- LESS
- JavaScript
- TypeScript
- CoffeeScript
- JSON
- YAML
- TOML

For a full list, please see the [Parcel documentation](TODO: link).

Parcel Prototyper also adds support for additional asset types:

- [CSV](./assets/csv.md)
- [Nunjucks](./assets/nunjucks.md)

## Module Resolution

Parcel provides some shortcuts for referencing assets to make things easier to maintain.

### Absolute paths

Absolute paths resolves an asset from the parent directory of all entrypoints, which defaults to `src/assets`.

So if you wanted to reference `src/assets/index.js` no matter where your asset is stored in the file structure, you would write `/index.js`.

### Tilde paths

Tildes can be used to resolve an asset from the nearest package root, which is the closest `node_modules` directory from `src/views`.

For example, if you wanted to reference a file from `node_modules/example-module` you would do `~example-module/example-file.js`.

For more details about module resolution, specific to JavaScript, see the [Parcel documentation](TODO: link).

## Static Assets

Parcel prototyper also adds support for static assets. These assets are totally ignored by the bundler, even if they are supported by the bundler, and are copied over to the build directory as-is.

To add static assets, simply add them to `src/static`. The contents of `src/static` will be copied exactly as-is to the `build` directory.

Any references to static assets in your assets will be left as-is as well.

E.g, if you had a the file `src/static/index.js`, it would be copied over to `dist/index.js`, and can be referenced in your assets as `./index.js`.