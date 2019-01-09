# Front Matter

Parcel prototyper allows you to add front matter to some assets that output as an HTML bundle.

This front matter is then usable in the template language of supported assets.

This allows you to create <abbr title="Don't repeat yourself">DRY</abbr> assets that don't repeat the same content or HTML markup, making it easier to build and maintain your prototype.

## Supported asset types

Currently Parcel Prototyper supports front matter for HTML assets and Nunjucks Assets.

## Supported front matter formats

Currently Parcel Prototyper supports YAML front matter.

## Using front matter

You can add front matter at the top of your asset's contents inside `---` delimiters, and then use it inside of your HTML.

For example, in `index.html`:

```
---
title: Hello world!
body: I'm alive!
---
<!doctype html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>
    <h1>{{ title }}</h1>
    <p>{{ body }}</h1>
</body>
</html>
```

Will become:

```
<!doctype html>
<html>
<head>
    <title>Hello world!</title>
</head>
<body>
    <h1>Hello world!</h1>
    <p>I'm alive!</h1>
</body>
</html>
```