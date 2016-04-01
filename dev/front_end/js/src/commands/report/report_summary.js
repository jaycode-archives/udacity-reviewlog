// report_summary [year_start] [month_start] [year_end] [month_end]
// report_monthly [year_start] [month_start] [year_end] [month_end]
// report_weekly [year_start] [month_start] [year_end] [month_end]

var app = app || {};
app.commands = app.commands || {};
app.commands.report = app.commands.report || {};

(function() {
  app.commands.report = {
    help: function(short) {
      if (short) {
        return "Show report page.";
      }
      else {
        return "" +
        "usage: report";
      }
    },
    run: function(args, terminal) {
      app.showPage('#report-main');
      var data = [];

      var tx = app.db.transaction("reviews", "readonly");
      var store = tx.objectStore("reviews");
      var index = store.index("by_assigned_at");

      var request;
      if (args.length == 0) {
        request = index.openCursor();
      }
      else {
        var dates = getDatesFromArgs(args);
        var fromDate = dates[0];
        var toDate = dates[1];

        request = index.openCursor(IDBKeyRange.bound(fromDate, toDate));
      }

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
    }
  }
})();