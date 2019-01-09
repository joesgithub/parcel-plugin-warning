# Routing

Parcel Prototyper implements a simple router for handling Javascript routing for simple HTML prototypes.

If you are using a framework like Vue, React, or Angular, using a router for those frameworks is usually preferred.

The router allows you to do things like:

- Redirect an old page to a new page
- Navigate to a new page
- Change page behaviour based on the page URL

## Using the router

To use the router, import it into a Javascript asset:

```
const Router = require('parcel-prototyper).Router;
const route = new Router();
```

## Methods

The router has the following methods:

## Add

The router allows you to bind to a URL path, such as `/index.html`, and then execute custom Javascript logic.

```
router.add(pattern, callback, priority);
```

### Paramaters

- *pattern* `string|RegExp`: a pattern to match against the current URL.
- *callback* `function`: a Javascript function to be executed when a route matches the current URL.
- *priority* `number`: a execution order priority, allowing you to specify which order routes should be applied if multiple routes match the current URL.

Trailing slashes at the end/begin of the pattern are ignored by default, so `/foo/` matches same requests as `foo`.

### Examples

#### Variables

If a pattern is a `string`, it can contain named variables surrounded by `{}` that will be passed to the `callback` as paramaters.

Each pattern segment is limited by the `/` character, so named variables will match anything until the next `/` character.

E.g, the pattern `{foo}/{bar}` will match `lorem/ipsum-dolor` but won't match `lorem/ipsum-dolor/sit`, and will be available in the callback as the paramaters `foo` and `bar`.

#### Optional variables

If a pattern is a `string`, it can also contain optional variables surrounded by `::`. These are not required for the route to match.

E.g. `news/:foo:/:bar:` will match `news`, `news/123` and `news/123/asd` and will be available in the callback as `foo` and `bar`.

```
router.add('news/:foo:/:bar:', function(foo, bar) {
    console.log(foo); // Will return the second URL segment
    console.log(bar); Will return the third URL segment
})
```

#### Wildcard variables

Patterns also allow wilcard variables (ending with `*`) which can match multiple URL segments. Wilcard variables can be optional and/or required and don't need to be the last segment of the pattern. 

E.g, `{foo}/:bar*:` will match `news`, `news/abc123`, `news/abc123/story`.

```
router.add('{foo}/:bar*:', function(foo, bar) {
    console.log(foo); // Will return the first URL segment
    console.log(bar); // Will return all subsequent URL segments
})
```

E.g, the pattern `{foo}/:bar*:` will match news `news/123`, `news/123/bar`, `news/123/lorem/ipsum` and will be available in the callback as `bar`.

#### Query strings

Patterns can capture query strings and pass them to a callback by starting a variable with a `?`.

E.g, `{?foo}` will match `?id=1&name=2`.

```
router.add('{?foo}`, function(foo) {
    console.log(foo); // All query params available as an object
})
```

#### Regular Expressions

If pattern is a RegExp, capturing groups will be passed as parameters to handlers on the same order as they were matched.

```
router.add(/^news\/([0-9]+)$/, function(id){
  console.log(id); // Will match the segment URL segment if it is a number
});
```

#### Attaching multiple callbacks to a route

You can store a route in a variable and re-use it to add multiple callbacks.

```
const exampleRoute = router.add('{article}/{id}');

exampleRoute.matched.add(function(category, name) {
    console.log(category);
});

exampleRoute.matched.add(function(category, name) {
    console.log(name);
});
```

#### Executing callback when switching from a route

You can execute a callback when the route matches, and the router is moving on to matching another route.

```
const exampleRoute = router.add('/example.html');

exampleRoute.switched.add(function() {
    console.log('Matching next route')
})
```

## Navigate

The navigate method allows you to send the browser to a new location, as if the user clicked a link. It maintains the original page in the browser's history.

```
router.navigate(path);
```

### Paramaters

* **path:** the path you want to navigate to

### Examples

```
router.add('/old.html', function() {
    router.navigate('/new.html);
})
```

## Redirect

The redirect method allows you to send the browser to a new location, as if the user never visited the original page. It replaces the original page in the browser's history.

```
router.redirect(path);
```

### Paramaters

* **path:** the path you want to redirect to

### Examples

```
router.add('/old.html', function() {
    router.redirect('/new.html);
})
```

## Back

The back method will send the user backwards to the last page in their history. This method requires the browser to support the [history API](TODO: link).

```
router.back();
```

## Forward

The back method will send the user forwards to the next page in their history. This method requires the browser to support the [history API](TODO: link).

```
router.forward();
```

## Go

The go method will send the user backwards or forwards a specified number of times. This method requires the browser to support the [history API](TODO: link).

```
router.go(amount);
```

### Paramaters

- **amount:** the amount of steps you want to take through the user's browser history. A negative number will go backwards, while a positive number will go forwards.

### Examples

```
router.go(3); // Will go forwards 3 times
router.go(-3); // Will go backwards 3 times
```

## Remove Route

The remove route method allows you to remove a route from the router instance, stopping the router from matching that route in the future.

```
router.removeRoute(route);
```

### Paramaters

- **route:** a reference to a previously created route

### Examples

Let's say you want to remove a route after it has been matched once.

```
const exampleRoute = router.add('/example.html');

exampleRoute.switched.add(function() {
    router.removeRoute(exampleRoute);
})
```