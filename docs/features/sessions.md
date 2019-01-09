# Sessions

Parcel Prototyper implements a session manager for storing user data in the user's browser for simple HTML prototypes.

If you are using a framework like Vue, React, or Angular, using a state manager for those frameworks is usually preferred.

The session manager allows you to do things like:

- Capture user input from forms in their browser for re-use
- Store and access data for business logic

## Using the session manager

To use the session manager, import it into a Javascript asset:

```
const SessionManager = require('parcel-prototyper).SessionManager;
const session = new SessionManager();
```

## Capturing form data

The session manager will automatically capture form data when a form is submitted. To do so, you must set up a valid HTML form, and ensure that all form fields you want captured have a `name` attribute.

E.g:

```
<form action="/thank-you.html" method="POST">
    <input type="email" name="email" placeholder="john.appleseed@apple.com">
    <input type="submit" value="Sign up">
</form>
```

The value of each field will be grabbed, and stored in the session using the `name` attribute as the `key`.

## Methods

The session manager has the following methods:

## Set

Store a value in the session at the specified key.

```
session.set(key, value);
```

### Paramaters

- **key** `string`: the key to access the value
- **value** `Any`: the value you wish to store. E.g, a string, number, object, or array.

### Examples

```
session.set('id', 1);
```

## Get

Retrive a value from the session from a specified key.

```
session.get(key);
```

### Paramaters

- **key** `string`: the key to access the value

### Examples

```
var id = session.get('id');
```

## Remove

Remove a value from the session at the specified key.

```
session.remove(key);
```

### Paramaters

- **key** `string`: the key to drop from the session

### Examples

```
session.remove('id');
```

### Clear

Clear all data from the session; resets the session to an empty state.

```
session.clear();
```