var app = app || {};
app.commands = app.commands || {};
/**
 * Report related commands.
 * @namespace app.commands.report
 */
app.commands.report = app.commands.report || {};

(function() {
  /** 
   * Shows report page and processes the reports there.
   * @method app.commands.report.report
   */
  app.commands.report.report = {
    help: function(short) {
      if (short) {
        return "Show report page.";
      }
      else {
        return "" +
        "usage 1: report\n" +
        "Display report of all reviews of all time.\n\n" +
        "usage 2: report [year]\n" +
        "Display report of all reviews in given year.\n\n" +
        "usage 3: report [year_start] [year_end]\n" +
        "Display report of reviews in between range of years.\n\n" +
        "usage 4: report [year_start] [month_start] [year_end] [month_end]\n" +
        "Display report of reviews in between range of year and months.";
      }
    },
    run: function(args, terminal) {
      app.showPage('#report-main');
      var data = [];

      var tx = app.db.transaction("reviews", "readonly");
      var store = tx.objectStore("reviews");
      var index = store.index("by_assigned_at");

      var request;
      var datesInfo = "All Time";
      if (args.length == 0) {
        request = index.openCursor();
      }
      else if (args.length == 1) {
        var fromDate = new Date(args[0] + ' Jan 01');
        var toDate = new Date(args[0] + ' Dec 31');
        request = index.openCursor(IDBKeyRange.bound(fromDate, toDate));
        datesInfo = fromDate.getDate() + ' ' + monthString(fromDate.getMonth() + 1) + ' ' + fromDate.getFullYear() +
                    ' - ' + toDate.getDate() + ' ' + monthString(toDate.getMonth() + 1) + ' ' + toDate.getFullYear();
      }
      else if (args.length == 2) {
        var fromDate = new Date(args[0] + ' Jan 01');
        var toDate = new Date(args[1] + ' Dec 31');
        request = index.openCursor(IDBKeyRange.bound(fromDate, toDate));
        datesInfo = fromDate.getDate() + ' ' + monthString(fromDate.getMonth() + 1) + ' ' + fromDate.getFullYear() +
                    ' - ' + toDate.getDate() + ' ' + monthString(toDate.getMonth() + 1) + ' ' + toDate.getFullYear();
      }
      else {
        var dates = getDatesFromArgs(args);
        var fromDate = dates[0];
        var toDate = dates[1];
        var toDateDisplay = toDate;
        if (args.length != 6) {
          toDateDisplay.setDate(toDateDisplay.getDate() - 1);
        }
        request = index.openCursor(IDBKeyRange.bound(fromDate, toDate));
        datesInfo = fromDate.getDate() + ' ' + monthString(fromDate.getMonth() + 1) + ' ' + fromDate.getFullYear() +
                    ' - ' + toDateDisplay.getDate() + ' ' + monthString(toDateDisplay.getMonth() + 1) + ' ' + toDateDisplay.getFullYear();
      }
      app.vm.datesInfo(datesInfo);

      request.onsuccess = function() {
        var cursor = request.result;
        if (cursor) {
          data.push({
            time: (cursor.value.assigned_at.getFullYear() + ' ' + 
            monthString(cursor.value.assigned_at.getMonth() + 1)),
            price: cursor.value.price,
            minutes_spent: (cursor.value.completed_at.getTime() - cursor.value.assigned_at.getTime())/1000/60
          });
          cursor.continue();
        }
      };

      tx.oncomplete = function() {
        app.timeViz.draw(data, '#report_panel-1', {
          timeFunc: function (d) {return d.time;},
          valGroupFunc: function (d) {return d3.sum(d, function(g) {return parseFloat(g.price);})},
          width: 450,
          height: 300,
          widthOffset: 50,
          heightOffset: 50,
          timeLabel: "Months",
          valLabel: "Total Earnings",
          title: "Total Earnings ($) By Months"
        });

        app.timeViz.draw(data, '#report_panel-2', {
          timeFunc: function (d) {return d.time;},
          valGroupFunc: function (d) {return d3.sum(d, function(g) {return 1;})},
          width: 450,
          height: 300,
          widthOffset: 50,
          heightOffset: 50,
          timeLabel: "Months",
          valLabel: "Total Reviews",
          title: "Number of Reviews By Months"
        });

        app.timeViz.draw(data, '#report_panel-3', {
          timeFunc: function (d) {return d.time;},
          valGroupFunc: function (d) {return d3.sum(d, function(g) {return parseFloat(g.minutes_spent);})},
          width: 450,
          height: 300,
          widthOffset: 50,
          heightOffset: 50,
          timeLabel: "Months",
          valLabel: "Minutes",
          title: "Time Spent (minutes) per Review By Months"
        });

        app.timeViz.draw(data, '#report_panel-4', {
          timeFunc: function (d) {return d.time;},
          valGroupFunc: function (d) {return d3.sum(d, function(g) {return parseFloat(g.price);}) / 
                                             d3.sum(d, function(g) {return parseFloat(g.minutes_spent/60);})},
          width: 450,
          height: 300,
          widthOffset: 50,
          heightOffset: 50,
          timeLabel: "Months",
          valLabel: "Hourly Earnings",
          title: "Hourly Earnings ($/hour) By Months"
        });
      }
      return "Processing report..."
    }
  }
})();