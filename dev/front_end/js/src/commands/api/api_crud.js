var app = app || {};
app.commands = app.commands || {};

(function() {
  /**
   * API related commands
   * @namespace app.commands.api
   */
  app.commands.api = {};

  /**
   * Sets Udacity API given key. Triggered by calling `set_api` command in console.
   * 
   * @method app.commands.api.set_api
   */
  app.commands.api.set_api = {
    help: function(short) {
      if (short) {
        return "Set Udacity API key.";
      }
      else {
        return "usage: set_api key\n\n" +
               "Arguments: \n" +
               "\tkey: Your Udacity api key (Get it from your dashboard, then click on \"API Access\")";
      }
    },
    run: function(args, terminal) {
      if (!args[0]) {
        return this.help(false);
      }
      else {
        var val = 'nothing';
        if (localStorage.udacity_api) {        
          val = localStorage.udacity_api;
        }
        terminal.echo("previous api value: " + val);
        val = args[0];
        localStorage.udacity_api = val.trim();
        return "new api value: " + val;
      }
    }
  };

  /**
   * Reads locally stored Udacity API code. Triggered by calling `read_api` command in console.
   * 
   * @method app.commands.api.read_api
   */
  app.commands.api.read_api = {
        help: function(short) {
          if (short) {
            return "Read locally stored Udacity API key.";
          }
          else {
            return "usage: read_api\n\n" +
                   "Reads locally stored Udacity API code";
          }
        },
        run: function(args, terminal) {
          var val = 'nothing';
          if (localStorage.udacity_api) {        
            val = localStorage.udacity_api;
          }
          return val;
        }
  };

  /**
   * Deletes locally stored Udacity API code. Triggered by calling `delete_api` command in console.
   * 
   * @method app.commands.api.delete_api
   */
  app.commands.api.delete_api = {
    help: function(short) {
      if (short) {
        return "Delete stored Udacity API key.";
      }
      else {
        return "usage: delete_api.";
      }
    },
    run: function(args, terminal) {
      var val = 'nothing';
      if (localStorage.udacity_api) {        
        val = localStorage.udacity_api;
      }
      terminal.echo("previous api value: " + val);
      val = null;
      localStorage.udacity_api = val;
      return "new api value: nothing";
    }
  };
})();