'use strict';

module.exports = function (session) {
  var Store = session.Store;

  function RethinkStore(options) {
    var self = this;

    options = options || {};
    options.table = options.table || 'sessions';
    this.instance = options.instance || require('rethinkdb');
    this.options = options;

    if (!options.connection) throw 'Invalid `connection` option specified. Please provide a promise or a function that has a callback.';
    if (!options.database) throw 'Invalid `database` option specified. This is required for creating the sessions table in the correct location';
    if (!options.table) throw 'Invalid `table` option specified. Please specify a string, or leave blank for default \'sessions\' value.';

    Store.call(this, options);

    if (options.connection.then) {
      options.connection.then(function (conn) {
        self.emit('connect', conn);
      }).catch(function (error) {
        self.emit('disconnect', error);
      })
    } else if (typeof options.connection === 'function') {
      options.connection(function (error, conn) {
        if (error) {
          return self.emit('disconnect', error);
        }

        self.emit('connect', conn);
      });
    }

    this.on('connect', function (conn) {
      var r = self.instance;
      var db = self.options.database;
      var table = self.options.table;

      conn.use(db);

      self.conn = conn;

      r.tableCreate(table).run(conn, function (err, res) {
        if (err) {
          console.log('Table \'' + table + '\' already exists, skipping creation -- ', err);
        }

        setInterval(function() {
          var now = new Date().getTime();

          try {
            r.db(db).table(table).filter(r.row('expires').lt(now)).delete().run(conn);
          } catch (error) {
            console.error(error);
          }
        }, options.flushInterval || 60000);
      });
    });
  }

  RethinkStore.prototype = new Store();

  // Get Session
  RethinkStore.prototype.get = function (sid, fn) {
    r.table(this.table).get(sid).run(this.conn).then(function (data) {
      fn(null, data ? JSON.parse(data.session) : null);
    }).error(function (err) {
      fn(err);
    });
  };

  // Set Session
  RethinkStore.prototype.set = function (sid, sess, fn) {
    var sessionToStore = {
      id: sid,
      expires: new Date().getTime() + (sess.cookie.originalMaxAge || this.sessionTimeout),
      session: JSON.stringify(sess)
    };

    r.table(this.table).insert(sessionToStore, { conflict: 'replace' }).run(this.conn).then(function (data) {
      if (typeof fn === 'function') {
        fn();
      }
    }).error(function (err) {
      fn(err);
    });
  };

  // Destroy Session
  RethinkStore.prototype.destroy = function (sid, fn) {
    r.table(this.table).get(sid).delete().run(this.conn).then(function (data) {
      if (typeof fn === 'function'){
        fn();
      }
    }).error(function (err) {
      fn(err);
    });
  };

  return RethinkStore;
};
