var app = app || {};
(function() {
  app.db = null;

  app.indexedStore = {
    version: 1
  };
  /**
  * Note that whenever setup needs to run (e.g. for adding new indexes etc.),
  * nukeDB needs to be run first.
  */
  app.indexedStore.setup = function() {
    // attempt to open the database
    var request = indexedDB.open("reviewlog", app.indexedStore.version);

    // upgrade/create the database if needed
    request.onupgradeneeded = function(event) {
      app.db = request.result;
      var reviewsStore = app.db.createObjectStore("reviews", { keyPath: "id" });
      reviewsStore.createIndex('by_id', 'id', {unique: true});
      reviewsStore.createIndex('by_completed_at', 'completed_at', {unique: false});

      app.db = request.result;
    };

    request.onsuccess = function(ev) {
      // assign the database for access outside
      app.db = request.result;
      app.db.onerror = function(ev) {
        console.log("db error", arguments);
      };
    };
  };

  app.indexedStore.nukeDB = function() {
    indexedDB.deleteDatabase('reviewlog');
  }

})();