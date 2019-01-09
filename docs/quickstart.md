# Quick start

Create you first prototype with Parcel Prototyper in 10 minutes.

## Installation

First, ensure [NPM](https://nodejs.org/en/download/) or [Yarn](https://yarnpkg.com/en/docs/install) is installed.

Then, install Parcel prototyper:

`Yarn`
```
yarn global add parcel-prototyper
```

`npm`
```
npm install -g parcel-prototyper
```

## Creating a new prototype

Start your new prototype by running:

```
parcel-prototyper init my-prototype
cd my-prototype
```

Parcel prototyper can take almost any type of file as an "entry point" for your prototype.

Generally HTML or Javascript files make the best entrypoints, as Parcel prototyper will try and find any references to other assets in your entry points and process them for you and replace the reference with the path to the output file.

To get started, open `src/views/index.html`. You should see:

```
<!doctype html>
<html lang="en">
<head>
    <title>My first prototype!</title>
    <link rel="stylesheet" type="text/css" href="./index.css">
</head>
<body>
  <script src="./index.js"></script>
</body>
</html>
```

Inside, we have a `link` tag referencing `./index.css`:

```
html, body {
    padding: 0;
    margin: 0;
}
```

As well as a `script` tag referencing `./index.js`:

```
console.log('Hello world!');
```

Then start the built-in development server by running:

```
parcel-prototyper serve
```

You should now be able to access your new prototype at `http://localhost:1234/index.html`.

Try changing `src/views/index.css` or opening the JavaScript console to see the `Hello world!` `console.log` from `src/views/index.js`.

## Building for production

When you're ready to share your prototype with others, you can generate an optimized production build by running:

```
parcel-prototyper build
```

For details on the optimizations run for production builds, see [Parcel's documentation](./production.md).