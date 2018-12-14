# `parcel-plugin-asset-csv`

> A parcel plugin for adding CSVs as a supported asset type

## Usage

Add the plugin to your project as a dependency:

```
npm install parcel-plugin-asset-csv --save
```

Then you can require CSVs in any asset type that outputs to JavaScript. _(e.g, .js or .ts)_:

`example.csv`
```csv
first name, last name, age
john, doe, 21
```

```js
const exampleCSV = require('./example.csv');

console.log(example.csv);
// => [['first name', 'last name', 'age', ['john', 'doe', '21']]

console.log(example.csv[0][0]);
// => 'first name'

console.log(example.csv[1][0]);
// => 'john'
```