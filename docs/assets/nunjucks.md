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

## Client-rendering

### Nunjucks

To use client rendering with Nunjucks, you need to include the `nunjucks-slim` library in a JavaScript entrypoint, or directly in your HTML templates.

From there, any views can be rendered using Nunjucks on the client, using the original filename of the asset.

E.g, to use `src/assets/index.njk` in the browser, the following can be done:

`src/assets/index.njk`:
```
---
title: My original title!
---
<!doctype html>
<html>
<body>
<h1>{{ title }}</h1>
</body>
</html>
```

`src/assets/index.js`:
```
const nunjucks = require('nunjucks/browser/nunjucks-slim');
const env = nunjucks.configure();
const data = {
    title: "My new title!"
}

env.render('index.njk', data, function(error, html) {
    if (err) {
        console.warn(err);
    } else {
        document.open();
        document.write(html);
        document.close();
    }
})
```

Which will result in the contents of the browser becoming:

```
<!doctype html>
<html>
<body>
<h1>My new title!</h1>
</body>
</html>
```