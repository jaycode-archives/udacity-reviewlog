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

test = function() {
  var tx = app.db.transaction("reviews", "readonly");
  var store = tx.objectStore("reviews");
  var index = store.index("by_id");

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
}