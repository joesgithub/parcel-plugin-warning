# Nunjucks Asset

**Supported extensions*: `.njk`, `.nunjucks`

Nunjucks is an HTML template engine created by Mozilla.

Nunjucks assets will be converted into separate HTML bundles, and then processed as HTML assets.

Any [front matter](./front-matter.md) or [data files](./data-files.md) will be available to Nunjucks for use in your templates.

## Usage

For example:

`src/assets/index.njk`
```
---
title: Hello world!
body: I am alive!
---
<!doctype html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>
    <h1>{{ title }}</h1>
    <p>{{ body }}</p>
</body>
</html>
```

Will become `dist/index.html`:

```
<!doctype html>
<html>
<head>
    <title>Hello world!</title>
</head>
<body>
    <h1>Hello world</h1>
    <p>I am alive!</p>
</body>
</html>
```

For more information on the features of Nunjucks, please see their [documentation](TODO: link).

## Configuring Nunjucks

You can configure Nunjucks by adding a `.nunjucksrc` or `.nunjucks.js` to the root of your project.

`.nunjucksrc` must contain a valid JSON object containing a Nunjucks configuration.

```
{
    "autoescape": false
}
```

`.nunjucks.js` must export a JavaScript object or function that returns a JavaScript object with a valid Nunjucks Environment configuration.

JavaScript functions are passed a `ctx` variable containing the following params:

- **locals** all of the local variables available to the asset being processed
- **bundlerOptions** the bundler's options, giving you access to build directories and more.

```
module.exports = (ctx) => {
    const nodeModuleViews = path.resolve(__dirname, "node_modules", "my-custom-views");

    return {
        autoescape: true,
        views: [
            ctx.bundlerOptions.rootDir,
            nodeModuleViews
        ]
    }
}
```

### Params

- **autoescape** _(default: `true`)_ controls if output with dangerous characters are escaped automatically. See Autoescaping
- **throwOnUndefined** _(default: `false`)_ throw errors when outputting a null/undefined value
- **trimBlocks** _(default: `false`)_ automatically remove trailing newlines from a block/tag
- **lstripBlocks** _(default: `false`)_ automatically remove leading whitespace from a block/tag
- **noCache** _(default: `false`)_ never use a cache and recompile templates each time (server-side)
- **tags** an object that defines the syntax for nunjucks tags. 
    - **blockStart**  _(default: `'{%'`)_ the format for an opening a block tag
    - **blockEnd** _(default: `'%}'`)_ the format for closing a block tag
    - **variableStart** _(default: `'{{'`)_ the format for opening a variable tag
    - **variableEnd** _(default: `'}}'`)_ the format for closing a variable tag
    - **commentStart** _(default: `'{#'`)_ the format for opening a comment tag
    - **commentEnd** _(default: `'#}'`)_ the format for closing a comment tag
- **views** _(default: `[bundlerOptions.rootDir]`) an array of directories Nunjucks should resolve views from
- **loaders** _(default: `[new nunjucks.FileSystemLoader(views)]`) an array of Nunjucks loaders to use