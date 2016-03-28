var app = app || {};
app.commands = app.commands || {};

(function() {
  app.commands.api = {};
  app.commands.api.set_api = {
    help: function(short) {
      if (short) {
        return "Set api key."
      }
      else {
        return "\
usage: set_api key\n\
\n\
Arguments: \n\
\tkey: Your Udacity api key (Get it from your dashboard, then click on \"API Access\")\
"
      }
    },
    run: function(args, terminal) {
      
      return "api command";
    }
  }
})();