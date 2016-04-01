/**
 * Main app's javascript code. Initialize everything here.
 * @namespace app
 */

var app = app || {};
(function() {

  /**
   * Main viewModel. A beacon for all other knockoutjs' viewmodels.
   * @class app.viewModel
   */
  app.viewModel = function() {
    self = this;

    self.report = new app.report();

    /**
     * Observable object to display date range on top of the app.
     */
    self.datesInfo = ko.observable('date');

    /**
     * Shrinks console size
     */
    self.shrinkConsole = function() {
      $('#console').css('height', 0);
      $('#main_area').css('padding-bottom', 60);
    };

    /**
     * Expands console size
     */
    self.expandConsole = function() {
      $('#console').css('height', app.data.settings.consoleDefaultHeight);
      $('#main_area').css('padding-bottom', app.data.settings.consoleDefaultHeight + 40);
    };

    /**
     * Maximizes console size
     */
    self.maximizeConsole = function() {
      $('#console').css('height', $(window).height()-53);
      $('#main_area').css('padding-bottom', 60);
    };

    /**
     * Decides whether to shrink or expand console size based on its current state.
     * Useful for the clickable box at the corner of console.
     */
    self.resizeConsole = function() {
      if (parseFloat($('#console').css('height')) < app.data.settings.consoleDefaultHeight) {
        self.expandConsole();
      }
      else {
        self.shrinkConsole();
      }
    };
  };

  /**
   * Shows a page, given selector of that page.
   */
  app.showPage = function(selector) {
    $('.page').removeClass('is_active');
    $(selector).addClass('is_active');
  };

  $(document).ready(function() {
    app.vm = new app.viewModel();
    ko.applyBindings(app.vm);

    app.vm.expandConsole();

    // Prepare the console here.
    jQuery(function($, undefined) {
      $('#console').terminal(function(command, term) {
        var cmd = $.terminal.splitCommand(command);
        // Find command
        var foundCommand = findCommand(cmd.name);
        
        if (foundCommand) {
          $('#console').terminal().echo(foundCommand.run(cmd.args, $('#console').terminal())+"\n");
        }
        else {
          $('#console').terminal().echo("Command not found. Run 'help' for list of commands\n");
        }
      }, {
        greetings: "Type 'help' for list of commands.",
        name: 'Udacity Review Log console',
        height: app.data.settings.consoleDefaultHeight,
        prompt: 'reviewlog> ',
        keydown: function(e) {
          if (e.which === 82 && e.ctrlKey) { // CTRL+R
            return true;
          }
          else if (e.which === 187 && e.altKey) { // ALT++
            app.vm.maximizeConsole();
            return true;
          }
          else if (e.which === 189 && e.altKey) { // ALT+-
            app.vm.shrinkConsole();
            return true;
          }
          else if (e.which === 48 && e.altKey) { // ALT+0
            app.vm.expandConsole();
            return true;
          }
        }
      });
    });
  });
  window.onload = function() {
    app.indexedStore.setup();
  };
})();
