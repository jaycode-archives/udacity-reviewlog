var app = app || {};
app.commands = app.commands || {};
app.commands.reviews = app.commands.reviews || {};

(function() {
  app.commands.reviews.list_reviews = {
    help: function(short) {
      if (short) {
        return "List reviews of given month";
      }
    },
    run: function(args, terminal) {
      var tx = app.db.transaction("reviews", "readonly");
      var store = tx.objectStore("reviews");
      var index = store.index("by_assigned_at");

      var request = index.openCursor();
      app.data.reviews = [];
      request.onsuccess = function() {
        var cursor = request.result;
        if (cursor) {
          var startTime = new Date(cursor.value.assigned_at);
          var endTime = new Date(cursor.value.completed_at);
          var minutesSpent = endTime.getHours()*60+endTime.getMinutes() - startTime.getHours()*60+startTime.getMinutes();
          // Called for each matching record.
          app.vm.reviews.push({
            project_name: cursor.value.project.name,
            date: startTime.toLocaleDateString('en-GB', {  
                      day : 'numeric',
                      month : 'numeric',
                      year : 'numeric'
                  }).split(' ').join('/'),
            time_start: leadString(startTime.getHours(), '00') + ':' + leadString(startTime.getMinutes(), '00'),
            time_end: leadString(endTime.getHours(), '00') + ':' + leadString(endTime.getMinutes(), '00'),
            time_spent: leadString(Math.floor(minutesSpent / 60), '00') + ':' + leadString(minutesSpent % 60, '00'),
            price: cursor.value.price,
            reference: cursor.value.user.name,
            link: '<a target="_blank" href="https://review.udacity.com/#!/reviews/' + cursor.value.id + '">'+cursor.value.id+'</a>',
            notes: ''
          });
          cursor.continue();
        } else {
          // No more matching records.
          console.log(null);
        }
      };

      app.showPage('#review-list');
      return "Loading list page...";
    }
  };
})();