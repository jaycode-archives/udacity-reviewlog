var app = app || {};
(function() {
  app.db = null;

  /**
   * This class contains useful IndexedStore related functions.
   * 
   * @class app.indexedStore
   */
  app.indexedStore = {
    version: 1
  };
  /**
  * This will setup indexedStore if the client does not already have it.
  * Increase the number of version when changes are added here (e.g. adding indexes).
  *
  * Note that whenever setup needs to run (e.g. for adding new indexes etc.),
  * {@link app.indexedStore.nukeDB} needs to be run first.
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

  /**
   * Destroys databases used in this application.
   */
  app.indexedStore.nukeDB = function() {
    indexedDB.deleteDatabase('reviewlog');
  };

})();