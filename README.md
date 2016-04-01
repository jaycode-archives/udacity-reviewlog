Udacity Review Log
---------------------

Client tool to read the log of your reviews. [See it live](http://jaycode.github.io/udacity-reviewlog/).

You can find things like:

1. How much do you earn per month?
2. How many projects do you complete per month?
3. How productive are you? (How long does it take to complete a project, roughly?)
4. Nice charts of your earnings throughout the months.

All data are stored locally in your local storage system, so you don't need to
worry about providing your API token. To verify this, open "inspect element" feature
from your browser and record your network activity (view "Network" tab) as you enter some random API code or pulling 
review data.


# Development Notes

- To add new javascript plugin, run `bower install pluginname`.
- This project uses Foundation with Grunt, so when you need to update your css, cd to `static` dir and run `grunt`.
  You may then update the scss files and they will be compiled into app.css used in this app.
- Documentation is made with jsdoc with baseline plugin. To export documentation,
  first [install jsdoc-baseline node module](https://github.com/hegemonic/jsdoc-baseline) 
  `npm install --save-dev https://github.com/jsdoc3/jsdoc/tarball/master`
  then to compile the documentation run `jsdoc -c jsdoc-conf.json`.