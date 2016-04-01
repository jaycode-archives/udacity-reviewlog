/**
 * Commands are the main units of action in this app.
 * 
 * Basically, a command consists of two methods: `help(short)` and `run(args, terminal)`.
 * `help` is called when `help [command_name]` is called, while `run` is when that command is
 * executed from the console.
 *
 * Namespace of a command is useful only to group that command, but it is not used for calling it.
 * For example, {@link app.commands.report} is called with command `report`. Due to this, make sure
 * that no two commands with the same name, even when they are under different namespaces.
 * 
 * @namespace app.commands
 */
var app = app || {};
app.commands = app.commands || {};

(function() {
  /**
   * Runs help command. Runs with command name to show long explanations of that command e.g. `help report`.
   * @method app.commands.help
   */
  app.commands.help = {
    help: function(short) {
      if (short) {
        return "This help command. Run help [command name] to find more details about that command";
      }
      else {
        return "";
      }
    },
    run: function(args, terminal) {
      if (args[0] != null) {
        command = findCommand(args[0]);
        if (command) {
          return command.help(false);
        }
        else {
          return "Command \""+args[0]+"\" not found.";
        }
      }
      else {
              var str = "\
------------\n\
Commands\n\
------------\n";
              var other_str = "Other:\n";
              for (command in app.commands) {
                if ('run' in app.commands[command]) {
                  other_str += "\t" + command + ": " + app.commands[command].help(true) + "\n";
                }
                else {
                  str += command + ":\n";
                  for (subcommand in app.commands[command]) {
                    str += "\t" + subcommand + ": " + app.commands[command][subcommand].help(true) + "\n";
                  }
                }
              }
              str += other_str;

              str += "\nOther useful commands:\n" +
                  "\tCTRL + L: Clear console.\n" +
                  "\tALT + +: Maximize console size.\n" +
                  "\tALT + -: Hide console.\n" +
                  "\tALT + 0: Standard console size.";
              
              if (localStorage.udacity_api) {
                var tx = app.db.transaction("reviews", "readonly");
                var store = tx.objectStore("reviews");
                var request = store.count();
                request.onsuccess = function() {
                  var count = request.result;
                  if (count == 0) {
                    terminal.echo("There is no review in your local storage. Run `pull_reviews [num_months]` to download reviews from Udacity server.\n");
                  }
                  else {
                    terminal.echo("You have " + count + " reviews stored. Run `list_reviews [year] [month]` to list them, or run report commands.\n");
                  }
                }
              }
              else {
                str += "\n\nYou have not setup Udacity API code. Set it using `set_api [key]`.";
              }
              return str;
      }
    }
  }
})();