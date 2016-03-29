/**
 * Report-related viewmodel.
 */

var app = app || {};
(function() {
  app.Report = function(data) {
    var self = this;
    
    self.totalReviews = ko.observable(0);
    self.totalIncome = ko.observable(0);
  }
})();