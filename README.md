# Express Session RethinkDB

RethinkDB session store for Express 4.x

## Installation

```
npm install express-session-rethinkdb --save
```

## Getting started

Note that you must already have Express Session already installed (`npm install express-session --save`).

```javascript
var express = require('express');
var cookie = require('cookie-parser');
var session = require('express-session');
var RDBStore = require('express-session-rethinkdb')(session);

var app = express();
var rdbStore = new RDBStore({
  // required, user specified
  database: 'mydb',
  connection: createConnection(),

  // optional, values shown are defaults default
  table: 'sessions',
  sessionTimeout: 86400000,
  flushInterval: 60000,
  instance: require('rethinkdb') // ^2.2.2
});

app.use(cookie());
app.use(session({
  key: 'sid',
  secret: 'my5uperSEC537(key)!',
  cookie: { maxAge: 860000 },
  store: rdbStore
}));

// the rest of your server code..
```

## Constructor options

### `database`
Required. Sets the database you want to use for your sessions table. Throws an error if not specified.

### `connection`
Required. Rethinkdb connection from the `rethinkdb` module. This can be a function that expects a callback, or
a promise. Throws an error if not specified.

### `instance`
Defaults to `require('rethinkdb')` which is set to `^2.2.2`. Specify your own if you need
a different version.

### `table`
Name of the table in which session data will be stored.
`Default: 'sessions'`

### `sessionTimeout`
If you do not set `cookie.maxAge` in `session` middleware, sessions will last until the user closes their browser.
However we cannot keep the session data infinitely (for size and security reasons).
In this case, this setting defines the maximum length of a session, even if the user does not close their browser.
`Default: 86400000` *1 day*

### `flushInterval`
RethinkDB does not yet provide an expiration function ( like `SETEX` for Redis ), so we have to remove the
old expired sessions from the database intermittently. This is the time interval in milliseconds between flushing of expired sessions.
`Default: 60000` *60 seconds*

## Attribution

*Inspired by TJ Holowaychuk's [Connect Redis](https://github.com/visionmedia/connect-redis)*

*Inspired by guillaumervls [Connect RethinkDB](https://github.com/guillaumervls/connect-rethinkdb)*
