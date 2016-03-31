/**
* Find command from {@link app.commands}
*
* @param {string} cmd: Command string.
*/
findCommand = function(cmd) {
  foundCommand = null;
  for (command in app.commands) {
    if ('run' in app.commands[command] && command == cmd) {
      foundCommand = app.commands[command];
    }
    else {
      for (subcommand in app.commands[command]) {
        if ('run' in app.commands[command][subcommand] && subcommand == cmd) {
          foundCommand = app.commands[command][subcommand];
        }
      }
    }
  }
  return foundCommand;
};

/**
 * Normalize months so there is no negative numbers.
 * Examples:
 * 0 turns into 12.
 * -1 turns into 11.
 * -2 turns into 10.
 * -12 turns into 12
 * 20 turns into 8.
 * @param {int} month: Month to normalize.
 */
normalizeMonth = function(month) {
  var result = (month) % 12;
  return result <= 0 ? result + 12: result;
};

testNormalizeMonth = function() {
  console.assert(normalizeMonth(0) == 12);
  console.assert(normalizeMonth(-1) == 11);
  console.assert(normalizeMonth(-2) == 10);
  console.assert(normalizeMonth(-12) == 12);
  console.assert(normalizeMonth(12) == 12);
  console.assert(normalizeMonth(20) == 8);
};

/**
 * Get years interval from months interval
 * Examples:
 * 1 turns into 0
 * 12 turns into 0 (because December is still not next year)
 * -13 turns into -1
 * 25 turns into 2
 * @param {int} months: Months interval.
 */
yearsFromMonths = function(months) {
  return Math.floor(months / 13);
};

monthString = function(monthInt) {
  var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  return months[monthInt-1];
};

/**
 * Add leading string, e.g. 5 to '05'.
 * @param {int} number: Number to convert.
 * @param {string} leadString: String showing lead text. With '000', 1 will be converted to '001'.
 */
leadString = function(number, leadString) {
  var str = leadString + number;
  return str.substr(str.length-leadString.length);
}

/**
 * Adds commas to number string, for example "10000" to "10,000".
 * @param {string|number} text String of number to we will add commas for.
 *   Due to how javascript works, you can pass in numbers as well.
 * @return {string} String of number with commas added.
 */
formatThousandSeparators = function(text) {
  return parseFloat(text).toLocaleString();
};

/**
 * Removes commas from given number string.
 * For example it converts "10,000" to 10000. This is useful for
 * preprocessing number prior to entering it to models.
 * @param {string} text String of number with comma separators.
 * @return {number} Numeric representation of given string.
 */
parseNumberWithSeparators = function(text) {
  return parseInt(text.toString().replace(/(\d+),(?=\d{3}(\D|$))/g, "$1"));
};

/**
 * Returns from and end dates from given array of arguments.
 * @param {array} args: Array of arguments.
 * @return {array} Array containing fromDate and endDate.
 */
getDatesFromArgs = function(args) {
  var fromDate;
  var endDate;
  if (args.length == 0) {
    var today = new Date();
    fromDate = new Date(today.getFullYear() + ' ' + (today.getMonth() + 1));
    endDate = new Date((today.getFullYear() + yearsFromMonths(today.getMonth() + 2) + ' ' + normalizeMonth(today.getMonth() + 2)));
  }
  else if (args.length == 2) {
    fromDate = new Date(args[0] + ' ' + args[1]);
    endDate = new Date((fromDate.getFullYear() + yearsFromMonths(fromDate.getMonth() + 2) + ' ' + normalizeMonth(fromDate.getMonth() + 2)));
  }
  else if (args.length == 4) {
    fromDate = new Date(args[0] + ' ' + args[1]);
    var until = new Date(args[2] + ' ' + args[3]);
    endDate = new Date((until.getFullYear() + yearsFromMonths(until.getMonth() + 2) + ' ' + normalizeMonth(until.getMonth() + 2)));
  }
  else if (args.length == 6) {
    fromDate = new Date(args[0] + ' ' + args[1] + ' ' + args[2]);
    endDate = new Date(args[3] + ' ' + args[4] + ' ' + args[5]);
  }
  else {
    throw new Error("Invalid number of arguments (should be 0, 2, 4, or 6");
  }

  return [fromDate, endDate];
}

testGetDatesFromArgs = function() {
  console.assert(getDatesFromArgs([])[0].getMonth(), (new Date()).getMonth());
  console.assert(getDatesFromArgs(['2016', 'Mar'])[0].getMonth(), 2);
  console.assert(getDatesFromArgs(['2016', 'Mar'])[1].getMonth(), 3);
  console.assert(getDatesFromArgs(['2015', 'Dec', '2016', 'Jan'])[0].getFullYear(), 2015);
  console.assert(getDatesFromArgs(['2015', 'Dec', '2016', 'Jan'])[0].getMonth(), 11);
  console.assert(getDatesFromArgs(['2015', 'Dec', '2016', 'Jan'])[1].getFullYear(), 2016);
  console.assert(getDatesFromArgs(['2015', 'Dec', '2016', 'Feb'])[1].getMonth(), 2);
  console.assert(getDatesFromArgs(['2015', 'Dec', '5', '2016', 'Feb', '7'])[0].getDate(), 5);
  console.assert(getDatesFromArgs(['2015', 'Dec', '5', '2016', 'Feb', '7'])[0].getDate(), 7);
  console.assert(getDatesFromArgs(['2015', 'Dec'])[1].getFullYear(), 2016);
  console.assert(getDatesFromArgs(['2015', 'Dec'])[1].getMonth(), 0);
}

formatTimeSpent = function(minutesSpent) {
  return Math.floor(minutesSpent / 60) + ' H ' + leadString(parseInt(minutesSpent) % 60, '00') + ' M';
}