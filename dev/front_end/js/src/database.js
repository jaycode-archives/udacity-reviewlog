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
      reviewsStore.createIndex('by_assigned_at', 'assigned_at', {unique: false});
    };

    request.onsuccess = function(ev) {
      // assign the database for access outside
      app.db = request.result;
      app.db.onerror = function(ev) {
        console.log("db error", arguments);
      };
    };

    request.onerror = function(event) {
      alert("Opening database failed. Error code: " + event.target.errorCode);
    };
  };

  app.indexedStore.nukeDB = function() {
    indexedDB.deleteDatabase('reviewlog');
  };

  /**
   * Test if indexedDB is supported and correct here.
   */
  app.indexedStore.test = function() {
    var request = indexedDB.open("test", app.indexedStore.version);

    // upgrade/create the database if needed
    request.onupgradeneeded = function(event) {
      app.db = request.result;
      var reviewsStore = app.db.createObjectStore("teststore", { keyPath: "id" });
      reviewsStore.createIndex('by_id', 'id', {unique: true});
    };

    request.onsuccess = function(ev) {
      // assign the database for access outside
      app.db = request.result;
      var tx = app.db.transaction('teststore', 'readwrite');
      var store = tx.objectStore("teststore");
      var request = store.put({'id': 1, 'name': 'test1'});
      request.onerror = function() {
        console.log(request.error);
      };

      request.onsuccess = function() {
        console.log("Added test data");
      };

      app.db.onerror = function(ev) {
        console.log("db error", arguments);
      };
    };

    request.onerror = function(event) {
      alert("Opening database failed. Error code: " + event.target.errorCode);
    };
  };

})();