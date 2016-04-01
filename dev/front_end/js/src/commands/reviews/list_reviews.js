var app = app || {};
app.commands = app.commands || {};
/**
 * Reviews related commands.
 * @namespace app.commands.reviews
 */
app.commands.reviews = app.commands.reviews || {};

(function() {
  /**
   * Lists locally stored reviews.
   * @method app.commands.reviews.list_reviews
   */
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
      app.data.reviews.length = 0;
      app.vm.report._totalEarnings(0.0);
      app.vm.report.totalReviews(0.0);
      app.vm.report._totalTimeSpent(0);
      app.vm.report._avgHourlyEarnings(0.0);
      var toDateDisplay = toDate;
      if (args.length != 6) {
        toDateDisplay.setDate(toDateDisplay.getDate() - 1);
      }
      app.vm.datesInfo(fromDate.getDate() + ' ' + monthString(fromDate.getMonth() + 1) + ' ' + fromDate.getFullYear() +
                       ' - ' + toDateDisplay.getDate() + ' ' + monthString(toDateDisplay.getMonth() + 1) + ' ' + toDateDisplay.getFullYear());
      var totalEarnings = 0;
      var totalReviews = 0;
      var totalTimeSpent = 0;
      var avgHourlyEarnings = 0;

      request.onsuccess = function() {
        var cursor = request.result;
        if (cursor) {
          var startTime = cursor.value.assigned_at;
          var endTime = cursor.value.completed_at;
          var minutesSpent = (endTime.getTime() - startTime.getTime())/1000/60;

          // var minutesSpent = (endTime.getHours()*60+endTime.getMinutes()) - (startTime.getHours()*60+startTime.getMinutes());
          // Called for each matching record.
          app.data.reviews.push({
            id: '',
            project_name: cursor.value.project.name,
            date: startTime.toLocaleDateString('en-GB', {  
                      day : 'numeric',
                      month : 'numeric',
                      year : 'numeric'
                  }).split(' ').join('/'),
            time_start: leadString(startTime.getHours(), '00') + ':' + leadString(startTime.getMinutes(), '00'),
            time_end: leadString(endTime.getHours(), '00') + ':' + leadString(endTime.getMinutes(), '00'),
            time_spent: formatTimeSpent(minutesSpent),
            price: cursor.value.price,
            reference: 'id (version)',
            link: '<a target="_blank" href="https://review.udacity.com/#!/reviews/' + cursor.value.id + '">'+cursor.value.id+'</a>',
            status: cursor.value.status
          });

          // Summary-related info:
          // app.vm.report._totalEarnings(app.vm.report._totalEarnings() + parseFloat(cursor.value.price));
          // app.vm.report.totalReviews(app.vm.report.totalReviews() + 1);
          // app.vm.report._totalTimeSpent(app.vm.report._totalTimeSpent() + minutesSpent);
          // app.vm.report._avgHourlyEarnings(app.vm.report._totalEarnings() / (app.vm.report._totalTimeSpent()/60));

          totalEarnings += parseFloat(cursor.value.price);
          totalReviews += 1;
          totalTimeSpent += minutesSpent;
          avgHourlyEarnings = totalEarnings / (totalTimeSpent / 60);

          cursor.continue();
        } else {
          // No more matching records.
          console.log(null);
        }
      };

      tx.oncomplete = function() {
        app.vm.report._totalEarnings(totalEarnings);
        app.vm.report.totalReviews(totalReviews);
        app.vm.report._totalTimeSpent(totalTimeSpent);
        app.vm.report._avgHourlyEarnings(avgHourlyEarnings);

        if ( $.fn.dataTable.isDataTable( '#review-list-table' ) ) {
            $('#review-list-table').dataTable().api().clear().rows.add(app.data.reviews).draw();
        }
        else {
          $('#review-list-table').dataTable( {
              lengthMenu: [ [100, -1], [100, 'All'] ],
              order: [[ 2, 'asc' ]],
              columns: [
                {'data': 'id', 'title': 'No.', 'orderable': false},
                {'data': 'project_name', 'title': 'Project Name'},
                {'data': 'date', 'title': 'Date', 'type': 'date'},
                {'data': 'time_start', 'title': 'Time Start'},
                {'data': 'time_end', 'title': 'Time End'},
                {'data': 'time_spent', 'title': 'Time Spent'},
                {'data': 'price', 'title': '$'},
                {'data': 'reference', 'title': 'Reference'},
                {'data': 'link', 'title': 'Link'},
                {'data': 'status', 'title': 'Status'}
              ],
              data: app.data.reviews,
              rowCallback: function(row, data, index) {
                // Set index row.
                $('td:eq(0)',row).html(index + 1);
                return row;
              }
          });
        }
      },
      app.showPage('#review-list');
      return "Loading list page...";
    }
  };
})();