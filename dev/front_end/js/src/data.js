/**
* Model of data used in app
*/
(function() {
  /**
   * This object contains all data used in this app.
   * @namespace app.data
   */
  app.data = {
    settings: {
      consoleDefaultHeight: 200,
      completedURL: 'https://review-api.udacity.com/api/v1/me/submissions/completed.json'
    }
  };

  /**
  * Reviews collection. This should kind of resemble the database.
  * We bind this object with knockout js.
  * @namespace app.data.reviews
  */
  app.data.reviews = [];

})();