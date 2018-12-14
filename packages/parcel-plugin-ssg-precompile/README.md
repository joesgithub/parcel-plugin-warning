# `parcel-plugin-ssg-precompile`

> Comapnion plugin for `parcel-plugin-ssg` that adds precompile support for certain template engines.

## Usage

Add the plugin to your project as a dependency:

```
npm install parcel-plugin-ssg-precompile --save
```

This will generate a precompiled javascript template to allow dynamic re-use in the client. This template is automatically added to the generated HTML via a script tag.

Please see usage instructions specific to the supported template engines:

- [Nunjucks](#nunjucks)

## Nunjucks

To use your precompiled template in the client, you must include the `nunjucks` or `nunjucks-slim.js` library in your bundle or on the page via a script tag. I.e,

```js
const nunjucks = require('nunjucks');

const updated = nunjucks.render('example-template.js', {title: 'My example page'})

document.innerHTML(updated);
```

```html
<script>
    const nunjucks = require('nunjucks');
    const updated = nunjucks.render('example-template.js', {title: 'My example page'})
    document.innerHTML(updated);
</script>
```