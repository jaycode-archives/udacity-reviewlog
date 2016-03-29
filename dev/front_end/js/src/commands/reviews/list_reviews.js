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

      $('#review-list-table').DataTable( {
          paging: true,
          pagingType: 'numbers',
          data: data.docs,
          columns: [
            {title: 'Project Name', data: 'name'},
            {title: 'Labeled', data: 'num_data_fields_labeled'},
            {title: 'Blocks', data: 'num_data_fields_total'},
            {title: 'Filesize', type: 'natural', data: 'size', render: function(size) {return (size).fileSize();}},
            {title: 'Status', data: function(row, type, set, meta) {
              var status = 'unprocessed';
              if (row.num_data_fields_labeled > 0) {
                status = 'labeled';
              } 
              return(status);}
            },
            {sortable: false, render: function(row) {return '<a role="button" onclick="app.vm.loadDoc(event);" class="button tiny inline">Load</a>';}}
          ]
      });
    }
  };
})();