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