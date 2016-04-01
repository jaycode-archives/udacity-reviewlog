/**
 * Report-related viewmodel.
 */

var app = app || {};
(function() {
  /**
   * @namespace app.report
   */
  app.report = function(data) {
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
      }
    });

    /**
     * Time spent in minutes.
     */
    self._totalTimeSpent = ko.observable(0);
    self.totalTimeSpent = ko.computed({
      /**
       * Returns time spent in hours and minutes format.
       * @memberOf app.Report#totalTimeSpent
       * @return {string}
       */
      read: function() {
        return formatTimeSpent(self._totalTimeSpent());
      }
    });
    self._avgHourlyEarnings = ko.observable(0.0);
    self.avgHourlyEarnings = ko.computed({
      /**
       * Returns average hourly earnings, {@link formatThousandSeparators separated by commas}.
       * @memberOf app.Report#avgHourlyEarnings
       * @return {string}
       */
      read: function() {
        return '$' + formatThousandSeparators(self._avgHourlyEarnings());
      }
    });

  }
})();