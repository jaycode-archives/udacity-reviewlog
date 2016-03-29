var app = app || {};
app.commands = app.commands || {};
app.commands.reviews = app.commands.reviews || {};

(function() {
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
          months = args[0] + 1;
        }

        if (args.length <= 1) {
          var endDate = new Date();
          var startMonth = normalizeMonth(endDate.getMonth() + 2 - months);
          var startYear = endDate.getFullYear() + yearsFromMonths(endDate.getMonth() + 1 - months);
          var startDate = new Date(startYear + ' ' + startMonth);
        }
        else {
          var startDate = args[0] + ' ' + args[1];
          var endDate = args[1] + ' ' + args[2];
        }
        var iterMonth = startDate.getMonth() + 1;
        var iterYear = startDate.getFullYear() + yearsFromMonths(endDate.getMonth() + 1 + 1);
        while (iterMonth != normalizeMonth(endDate.getMonth() + 2) || 
               iterYear != (endDate.getFullYear() - yearsFromMonths(endDate.getMonth() + 2))) {
          batch.push( function() {
            var sYear = arguments[0];
            var sMonth = monthString(arguments[1]);
            var eYear = (arguments[0] + yearsFromMonths(arguments[1] + 1));
            // Not currently used, for reference only
            // var eMonth = monthString(normalizeMonth(arguments[1] + 1));

            terminal.echo('Getting data from ' + sYear + ' ' + sMonth + '...');

            // Converts "1" to "01"
            var str1 = "00" + arguments[1];
            var sMonthToSend = str1.substr(str1.length-2);
            var str2 = "00" + normalizeMonth(arguments[1] + 1);
            var eMonthToSend = str2.substr(str2.length-2);

            return $.ajax({
              type: 'GET',
              url: app.data.settings.completedURL,
              data: {
                start_date: sYear + '-' + sMonthToSend + '-01',
                end_date: eYear + '-' + eMonthToSend + '-01',
              },
              headers: {
                  "Authorization":localStorage.udacity_api
              }
            }).done(function(data) {
                terminal.echo('Retrieved ' + data.length + ' completed reviews.');
                for (id in data) {
                  var datum = data[id];
                  var tx = app.db.transaction('reviews', 'readwrite');
                  var store = tx.objectStore("reviews");
                  var request = store.put(datum);
                  request.onerror = function() {
                    terminal.echo(request.error);
                  };
                  tx.onabort = function() {
                    terminal.echo(tx.error);
                  };
                }
            });

            }.apply(this, [iterYear, iterMonth])
          );

          iterMonth += 1;
          iterYear += yearsFromMonths(iterMonth);
          iterMonth = normalizeMonth(iterMonth);
        }

        batch.reduce(function(chain, callback) { 
          if(chain) { 
            return chain.then(function(data) { return callback(data); });
          }
        }, null);
      }
      else {
        return "Set api code with `set_api [key]` command first.";
      }
    }

  };
})();