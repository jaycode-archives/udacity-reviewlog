var app = app || {};
app.commands = app.commands || {};
app.commands.reviews = app.commands.reviews || {};

(function() {
  app.commands.reviews.list_reviews = {
    help: function(short) {

    },
    run: function(args, terminal) {
      var tx = app.db.transaction("reviews", "readonly");
      var store = tx.objectStore("reviews");
      var index = store.index("by_completed_at");

      var request = index.openCursor();
      request.onsuccess = function() {
        var cursor = request.result;
        if (cursor) {
          // Called for each matching record.
          console.log(cursor.value.id + " " + cursor.value.name);
          cursor.continue();
        } else {
          // No more matching records.
          console.log(null);
        }
      };
    }
  };
})();