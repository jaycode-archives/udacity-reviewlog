var app = app || {};
app.commands = app.commands || {};

(function() {
  app.commands.help = {
    help: function(short) {
      if (short) {
        return "This help command. Run help [command name] to find more details about that command";
      }
      else {
        return "";
      }
    },
    run: function(args) {
      if (args) {
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
------------\n\
        ";
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

              return str;
      }
    }
  }
})();