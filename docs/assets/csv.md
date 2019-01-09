# CSV Asset

**Supported extensions**: `csv`

CSV assets can be referenced in JavaScript files, and are turned into an array of arrays.

E.g, in `people.csv`:

```
first,last
john,doe
mary,poppins
```

In `index.js`:

```
const people = require('./people.csv');
// => becomes [[first, last], [john, doe], [mary, poppins]]
```