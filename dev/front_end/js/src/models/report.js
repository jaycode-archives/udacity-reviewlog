/**
 * Report-related viewmodel.
 */

var app = app || {};
(function() {
  app.Report = function(data) {
    var self = this;
    
    self.totalReviews = ko.observable(0.0);
    self._totalEarnings = ko.observable(0.0);
    self.totalEarnings = ko.computed({
      /**
       * Returns total income, {@link formatThousandSeparators separated by commas}.
       * @memberOf app.Report#totalEarnings
       * @return {string}
       */
      read: function() {
        return '$' + formatThousandSeparators(self._totalEarnings());
      },
      /**
       * Writes to {@link app.Report#_totalEarnings}
       * @memberOf app.Report#totalEarnings
       * @param {string|number} value Could be "10,000.00" or 10000.00.
       */
      write: function(value) {
        self._totalEarnings(parseNumberWithSeparators(value));
      }
    })
  }
})();