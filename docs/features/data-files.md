# Data Files

Parcel prototyper allows you to add data files to your prototype, which are then accessible in all asset types that output as an HTML bundle.

This allows you to define content, business rules, and other forms of data in one place and re-use them throughout all of your prototype.

## Supported asset types

Parcel prototyper supports the following asset types as data files:

- CSV
- JSON
- YAML
- TOML
- JS

## Using data files

To use data files, place any supported asset types inside the `src/data` folder.

Data files are parsed and the data is made available using the filename minus the extension on the `globals` key.

E.g,

| File | Key |
| --- | --- |
| `src/data/example.yaml` | `globals.example` |
| `src/data/example/example.yaml` | `globals.example.example` |

Consider the following data file, `src/data/example.yaml`:

```
title: Hello world!
```

To access `title`, you would use `globals.example.title`.

## Caveats

### JavaScript assets

Javascript assets must have a single export which is a Javascript `object` or a function that returns an `object`.

### Naming Collisions

If you have two assets with the same filename, only one of the assets will be made available in your templates.

E.g, if you have `example.yml` and `example.json`, you will only get data from one of these files.
