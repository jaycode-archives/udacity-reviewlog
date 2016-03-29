var app = app || {};
app.commands = app.commands || {};
app.commands.reviews = app.commands.reviews || {};

(function() {
  app.commands.reviews.list_reviews = {
    help: function(short) {
      if (short) {
        return "List reviews of given year and month range.";
      }
      else {
        return "" +
        "usage 1: list_reviews\n" +
        "List all completed reviews this month.\n\n" +
        "usage 2: list_reviews [year] [month]\n" +
        "List reviews on given year and month.\n\n" +
        "usage 3: list_reviews [year_start] [month_start] [year_end] [month_end]\n" +
        "List reviews between range of year and months.";
      }
    },
    run: function(args, terminal) {
      var tx = app.db.transaction("reviews", "readonly");
      var store = tx.objectStore("reviews");
      var index = store.index("by_assigned_at");

      var dates = getDatesFromArgs(args);
      var fromDate = dates[0];
      var toDate = dates[1];
      var request = index.openCursor(IDBKeyRange.bound(fromDate, toDate));
      // var request = index.openCursor();
      app.vm.reviews.removeAll();
      app.vm.report.totalEarnings(0.0);
      app.vm.report.totalReviews(0.0);

      request.onsuccess = function() {
        var cursor = request.result;
        if (cursor) {
          var startTime = cursor.value.assigned_at;
          var endTime = cursor.value.completed_at;
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
            reference: 'id (version)',
            link: '<a target="_blank" href="https://review.udacity.com/#!/reviews/' + cursor.value.id + '">'+cursor.value.id+'</a>',
            notes: ''
          });

          // Summary-related info:
          app.vm.report.totalEarnings(app.vm.report._totalEarnings() + parseFloat(cursor.value.price));
          app.vm.report.totalReviews(app.vm.report.totalReviews() + 1);

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