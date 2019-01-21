# `parcel-plugin-ssg`

> Adds basic static site generator functionality to Parcel

Tries to supports _any_ [consolidate.js](https://github.com/tj/consolidate.js/) template engine on top of the built-in [PostHTML](https://parceljs.org/html.html#posthtml) functionality. See [official support](#official-support) for guaranteed support.

## Usage

Add the plugin to your project as a dependency:

```
npm install parcel-plugin-ssg posthtml-expressions --save
```

Update or add a `posthtml.config.js` to the root of your project with the following contents:

```
module.exports = (ctx) => {
    return {
        plugins: {
            'posthtml-expressions': {locals: ctx.locals}
        }
    }
}
```

Now you can start using the following features:

- [Consolidate.js template engines](#consolidate.js-template-engines)
- [Front matter](#front-matter)
- [Global data through data files](#global-data-through-data-files)

## Output files

This plugin modifies Parcel's output behaviour for supported assets that output HTML files, in order to generate valid file structures for websites.

For example, while `example.html` would be output to `example.html` normally, in this case it is output as `example/index.html` to enable proper URL structures for a website.

## Consolidate.js Template Engines

To use a consolidate.js compatible template engine, simply create a new asset with a valid file extension for that engine.

View the [extension map](./lib/utils/extMap.js) for more details.

## Front matter

Front matter is structured data at the top of a valid asset type that will output HTML.

It allows you to define data to be used inside of your asset to dynamically generate markup, keep your content DRY, and setup custom display logic.

Front matter is defined as YAML at the top of the asset, with an opening and closing delimiter `---`. E.g:

`example.njk`
```
---
title: My example page
description: This is my example page
list:
 - item 1
 - item 2
 - item 3
---
<h1>{{ title }}</h1>
<p>{{ descroption }}</h2>
<ul>
{% for item in list %}
    <li>{{ item }}</li>
{% endfor %}
```

Becomes:

`example/index.html`
```
<h1>My example page</h1>
<p>This is my example page</p>
<ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
</ul>
```

## Global data through data files

Global data can also be made available to _all_ supported asset types using data files.

Data files are any asset found in the root directory of your Parcel project matching the following asset types:

- CSV
- JSON/JSON5
- YAML
- TOML
- JavaScript _(only if the file exports an object)_.

Data files are made available through a `globals` variable in your HTML-output assets, and are accessible by their file path, relative from the Parcel project root.

### Some examples: 

If you had a JSON file accessible from the root at `example.json`:

`example.json`
```
{
    "exampleVal": true
}
```

`exampleVal` can be accessed in your views using `globals.example.exampleVal`.

---

If you had a JSON file accessible from the root at `data/example.json`:

`data/example.json`
```
{
    "exampleVal": true
}
```

`exampleVal` can be accessed in your views using `globals.data.example.exampleVal`.

---

If you had a JSON file accessible from the root at `admin/public/example.json`:

`admin/public/example.json`
```
{
    "exampleVal": true
}
```

`exampleVal` can be accessed in your views using `globals.admin.public.example.exampleVal`.

### Caveats

Please be aware that if you have two sibling assets with the same name, their data will be combined in the order that Parcel finds them.

For example, if you had a JSON and YAML file accessible from the root at `example.json` and `example.yaml`, they will be combined. Any identical keys will be overwritten.

## Configuring engines

Each consolidate engine can be configured by adding a valid configuration file for that engine to the root of your project, following the conventions:

- `.{{ engine }}rc`
  - Must be a valid JSON object of the engine's standard config
- `.{{ engine }}.js`
  - Must export: 
    - a JavaScript object of the engine's standard config
    - a function that rteurns a JavaScript object of the engine's standard config

E.g, for nunjucks you can add a `.nunjucksrc` or `.nunjucks.js` to the root of your project to configure the engine.

`.nunjucksrc`:

```
{
    "autoescape": true,
    "throwOnUndefined": false,
    "trimBlocks": false,
    "lstripBlocks": false,
    "tags": {
        "blockStart": '<%',
        "blockEnd": '%>',
        "variableStart": '<$',
        "variableEnd": '$>',
        "commentStart": '<#',
        "commentEnd": '#>'
    }
}
```

`.nunjucks.js`:

```
module.exports = () => {
    return {
        autoescape: true,
        throwOnUndefined: false,
        trimBlocks: false,
        lstripBlocks: false,
        tags: {
            blockStart: '<%',
            blockEnd: '%>',
            variableStart" '<$',
            variableEnd: '$>',
            commentStart: '<#',
            commentEnd: '#>'
        }
    }
}
```


## Official support

Currently the following [consolidate.js](https://github.com/tj/consolidate.js/) template engines are officially supported:

- [Nunjucks](https://mozilla.github.io/nunjucks/)
