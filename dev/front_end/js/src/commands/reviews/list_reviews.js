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
          // Called for each matching record.
          app.reviews.push({
            project_name: cursor.value.project_id,
            date: '',
            time_start: 0,
            time_end: 0,
            time_spent: 0,
            price: cursor.value.price,
            reference: '',
            link: 'a',
            notes: 'a'
          });
          cursor.continue();
        } else {
          // No more matching records.
          console.log(null);
        }
      };


      // $('#review-list-table').DataTable( {
      //     paging: true,
      //     pagingType: 'numbers',
      //     data: data.docs,
      //     columns: [
      //       {title: 'Project Name', data: 'project_name'},
      //       {title: 'Date', data: 'assigned_at'},
      //       {title: 'Time Start', data: 'assigned_at'},
      //       {title: 'Time End', data: 'completed_at'},
      //       {title: 'Time Spent', data: function(row, type, set, meta) {
      //         var status = 'unprocessed';
      //         if (row.num_data_fields_labeled > 0) {
      //           status = 'labeled';
      //         } 
      //         return(status);}
      //       },
      //       {title: '$', data: 'price'},
      //       {title: 'Identifier', data: 'id'},
      //       {title: 'Link', data: 'id'},
      //       {title: 'Notes'}
      //     ]
      // });
      app.showPage('#review-list');
      return "Loading list page...";
    }
  };
})();