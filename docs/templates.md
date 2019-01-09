# Templates

Parcel prototyper allows you to create templates for new prototypes, which allow you to quickstart a prototype with default entrypoints, assets, transform configurations, as well as install additional plugins and/or NPM dependencies for use in your prototype.

They can be any valid NPM dependency, such as a package in the NPM registry, a Git repository, or a file on your local filesystem.

Templates are used when initializing a new prototype using the CLI by passing the `--template` flag:

```
parcel-prototyper init my-template --template=parcel-prototyper-template-default
```

## Creating a template

A template requires a `package.json` file with a `name` and `main` property.

The `name` property must follow the format `parcel-prototyper-template-*`, e.g: `parcel-prototyper-template-default`.

The `main` property most point to a valid Javascript entrypoint.

For example:

```
{
    "name": "parcel-prototyper-template-default",
    "main": "index.js"
}
```

You can set this up easily using NPM or Yarn:

First, create you new template's folder:

Yarn:

```
mkdir parcel-prototyper-template-example
cd parcel-prototyper-template-example
yarn init -y
```

NPM:

```
mkdir parcel-prototyper-template-example
cd parcel-prototyper-template-example
npm init -y
```

## Adding default files

Any files found in the `src` folder at the root of a template will be copied over when initializing a prototype using the template, and the end user will be prompted to overwrite or ignore a file if it already exists.

For example, lets say you wanted to include an `index.html`, `index.css`, and `index.js` entrypoint each time a prototype is initialized with the template.

Create a `src` folder, and inside a `views` folder. Then place `index.html`, `index.css`, and `index.js` inside and they will be included in every prototype created with your template.

## Updating from templates

At any time you can update your prototype to match the contents of the template by running:

```
parcel-prototyper update
```

This will copy all of the default files from the template that don't exist, and prompt you to overwrite or ignore any files that do exist in case you have made modifications to the original.

