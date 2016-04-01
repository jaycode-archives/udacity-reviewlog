var app = app || {};
app.commands = app.commands || {};
app.commands.reviews = app.commands.reviews || {};

(function() {
  /**
   * Pulls reviews from Udacity server.
   * @method app.command.reviews.pull_reviews
   */
  app.commands.reviews.pull_reviews = {
    help: function(short) {
      if (short) {
        return "Download reviews from Udacity server."
      }
      else {
        return "usage 1: pull_reviews [num_months]\n" +
               "\n" +
               "Optional Arguments:\n" +
               "\tnum_months: Number of months back. Default to 3 months when not given.\n\n" +
               "usage 2: pull_reviews [year_start] [month_start] [year_end] [month_end]\n" +
               "\n"
               "Optional Arguments:n\n" +
               "\tyear_start: Year start\n" +
               "\tmonth_start: Month start (in number or text)\n" +
               "\tyear_end: Year end\n" +
               "\tmonth_end: Month end (in number or text)\n" +
               "Example: pull_reviews 2015 Dec 2016 Mar"
      }
    },
    /**
    * Running a pull reviews command.
    *
    * This command will divide given date range and split it by months.
    * It will then send a pull request to server pulling completed reviews
    * one month at a time.
    * @param {Object} args: Arguments to be passed to this function, refer to
    *                       {@link help} method for more info.
    * @param {Object} terminal: Terminal instance. Several things can be done
    *                           with this, e.g. echo-ing messages as process is running.
    */
    run: function(args, terminal) {
      if (localStorage.udacity_api) {
        var batch = [];
        // Default: Get 3 months back.
        var months = 3;
        if (args.length == 1) {
          months = parseInt(args[0]);
        }

        if (args.length <= 1) {
          var endDate = new Date();
          var startMonth = normalizeMonth(endDate.getMonth() + 2 - months);
          var startYear = endDate.getFullYear() + yearsFromMonths(endDate.getMonth() + 1 - months);
          var startDate = new Date(startYear + ' ' + startMonth);
        }
        else {
          var startDate = new Date(args[0] + ' ' + args[1]);
          var endDate = new Date(args[2] + ' ' + args[3]);
        }


        var iterMonth = startDate.getMonth() + 1;
        var iterYear = startDate.getFullYear() + yearsFromMonths(endDate.getMonth() + 1 + 1);
        while (iterMonth != normalizeMonth(endDate.getMonth() + 2) || 
               iterYear != (endDate.getFullYear() - yearsFromMonths(endDate.getMonth() + 2))) {

          var sYear = iterYear;
          var sMonth = monthString(iterMonth);
          var eYear = (iterYear + yearsFromMonths(iterMonth + 1));
          // Not currently used, for reference only
          // var eMonth = monthString(normalizeMonth(arguments[1] + 1));
          
          terminal.echo('Gathering reviews from ' + sYear + ' ' + sMonth + '...');

          var sMonthToSend = leadString(iterMonth, '00');
          var eMonthToSend = leadString(normalizeMonth(iterMonth + 1), '00');

          batch.push([$.ajax({
            type: 'GET',
            url: app.data.settings.completedURL,
            data: {
              start_date: sYear + '-' + sMonthToSend + '-01',
              end_date: eYear + '-' + eMonthToSend + '-01',
            },
            headers: {
                "Authorization":localStorage.udacity_api
            },
            error: function(xhr, status, errorThrown) {
              terminal.echo("Error: " + errorThrown);
              if (xhr.status == 401) {
                terminal.echo("Check your API code with `read_api` command.");
              }
            }
          }), sYear, sMonth]);

          iterMonth += 1;
          iterYear += yearsFromMonths(iterMonth);
          iterMonth = normalizeMonth(iterMonth);
        };

        var keepData = function(data, sYear, sMonth) {
          terminal.echo('Retrieved ' + data.length + ' completed reviews from ' + sYear + ' ' + sMonth + '.');
          for (id in data) {
            var datum = data[id];
            var tx = app.db.transaction('reviews', 'readwrite');
            var store = tx.objectStore("reviews");
            datum.assigned_at = new Date(datum.assigned_at);
            datum.created_at = new Date(datum.created_at);
            datum.completed_at = new Date(datum.completed_at);

            var request = store.put(datum);
            request.onerror = function() {
              terminal.echo(request.error);
            };
            tx.onabort = function() {
              terminal.echo(tx.error);
            };
          }
        }

        // Reference: Next, we're basically going to use "then" method
        // to chain ajax methods similar to following:
        //
        // batch[0].then(function(data) {
        //   terminal.echo('Retrieved ' + data.length + ' completed reviews.');
        //   return batch[1];
        // }).then(function(data) {
        //   terminal.echo('Retrieved ' + data.length + ' completed reviews.');
        //   return batch[2];
        // }).done(function(data) {
        //   terminal.echo('Retrieved ' + data.length + ' completed reviews.');
        // });

        // Not sure how to do this without eval.
        // var thenCode = "batch[0][0]";
        // for (var i=0;i<batch.length-1;i++) {
        //   thenCode += ".then(function(data) {" +
        //                 "keepData(data, batch["+i+"][1], batch["+i+"][2]);" +
        //                 "return batch["+(i+1)+"][0];" +
        //               "})";
        // }
        // thenCode += ".done(function(data) {" +
        //                 "keepData(data, batch["+i+"][1], batch["+i+"][2]);" +
        //               "})";
        // eval(thenCode);

        // Alright here is how to do it without eval, but we have
        // weird behavior of bind and arguments, somehow we can no 
        // longer use 'data' inside then().
        var code = batch[0][0];
        for (var i=0;i<batch.length-1;i++) {
          code = code.then(function(data) {
            keepData(arguments[2], arguments[0][1], arguments[0][2]);
            return arguments[1][0];
          }.bind(this, batch[i], batch[i+1]));
        }
        code = code.done(function(data) {
          keepData(data, batch[i][1], batch[i][2]);
        });

        return '';
      }
      else {
        return "Set api code with `set_api [key]` command first.";
      }
    }

  };
})();