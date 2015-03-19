Express Session RethinkDB
=================

###RethinkDB session store for Express 4.x 

*Inspired by TJ Holowaychuk's [Connect Redis](https://github.com/visionmedia/connect-redis)*

*Inspired by guillaumervls [Connect RethinkDB](https://github.com/guillaumervls/connect-rethinkdb)*

##Installation

```npm install express-session-rethinkdb```

##Getting started

Note that you must already have Express Session already installed (```npm install express-session```).

```javascript
var express = require('express');
var session = require('express-session');
var RDBStore = require('express-session-rethinkdb')(session);

var rDBStore = new RDBStore({
  connectOptions: {
    db: 'test',
    host: 'localhost',
    port: '28015'
  },
  table: 'session',
  sessionTimeout: 86400000,
  flushInterval: 60000
});

var app = express();
app.use( require('cookie-parser')() );
app.use( session({
    key: "sid",
    secret: "my5uperSEC537(key)!",
    cookie: { maxAge: 860000 },
    store: rDBStore 
  })
);

app.use( ... );
```

##Constructor options

###connectOptions
Options for connecting to the database server. 
*See [RethinkDB's doc](http://www.rethinkdb.com/api/javascript/#connect)*

###table
Name of the table in which session data will be stored.
`Default: 'session'`

###sessionTimeout
If you do not set ```cookie.maxAge``` in ```session``` middleware, sessions will last until the user closes their browser. 
However we cannot keep the session data infinitely (for size and security reasons). 
In this case, this setting defines the maximum length of a session, even if the user does not close their browser. 
`Default: 86400000` *1 day*

###flushInterval
RethinkDB does not yet provide an expiration function ( like ```SETEX``` for Redis ), so we have to remove the old expired sessions from the database intermittently. This is the time interval in milliseconds between flushing of expired sessions.
`Default: 60000` *60 seconds*

##License

The MIT License (MIT)

Copyright (c) 2014 Armen Filipetyan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
