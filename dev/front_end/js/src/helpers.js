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
}