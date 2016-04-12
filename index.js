/*!
 *  Express Session RethinkDB
 *  MIT Licensed
 */

var rethinkdb = require('rethinkdbdash');
var cache = require('memory-cache');

module.exports = function (session) {
  var Store = session.Store;

  function RethinkStore(options) {
    options = options || {};
    options.connectOptions = options.connectOptions || {};

    Store.call(this, options);

    r = new rethinkdb(options.connectOptions);

    this.emit('connect');
    this.sessionTimeout = options.sessionTimeout || 86400000; // 1 day
    this.table = options.table || 'session';
    this.debug = options.debug || false;
    setInterval( function() {
      try {
        r.table(this.table).filter( r.row('expires').lt(r.now().toEpochTime().mul(1000)) ).delete().run();
      }
      catch (error) {
        console.error( error );
      }
    }.bind( this ), options.flushInterval || 60000 );
  }

  RethinkStore.prototype = new Store();

  // Get Session
  RethinkStore.prototype.get = function (sid, fn) {
    var sdata = cache.get('sess-'+sid);
    if (sdata) {
      if( this.debug ){ console.log( 'SESSION: (get)', JSON.parse(sdata.session) ) };
      fn(null, JSON.parse(sdata.session));
    } else {
        r.table(this.table).get(sid).run().then(function (data) {
          fn(null, data ? JSON.parse(data.session) : null);
        }).error(function (err) {
          fn(err);
        });
    }
  };

  // Set Session
  RethinkStore.prototype.set = function (sid, sess, fn) {
    var sessionToStore = {
      id: sid,
      expires: new Date().getTime() + (sess.cookie.originalMaxAge || this.sessionTimeout),
      session: JSON.stringify(sess)
    };

    r.table(this.table).insert(sessionToStore, { conflict: 'replace', returnChanges: true }).run().then(function (data) {
      var sdata = null;
      if(data.changes[0] != null)
        sdata = data.changes[0].new_val || null;
      if (sdata){
          if (this.debug){ console.log( 'SESSION: (set)', sdata.id ); }
          cache.put( 'sess-'+ sdata.id, sdata, 30000 );
      }
      if (typeof fn === 'function') {
        fn();
      }
    }).error(function (err) {
      fn(err);
    });
  };

  // Destroy Session
  RethinkStore.prototype.destroy = function (sid, fn) {
    if (this.debug){ console.log( 'SESSION: (destroy)', sid ); }
    cache.del('sess-'+sid);
    r.table(this.table).get(sid).delete().run().then(function (data) {
      if (typeof fn === 'function'){
        fn();
      }
    }).error(function (err) {
      fn(err);
    });
  };

  return RethinkStore;
};
