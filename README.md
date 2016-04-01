Udacity Review Log
---------------------

Client tool to read the log of your reviews. [See it live](http://jaycode.github.io/udacity-reviewlog/).

Documentation is available [here](http://jaycode.github.io/udacity-reviewlog/docs/index.html).

You can find things like:

1. How much do you earn per month?
2. How many projects do you complete per month?
3. How productive are you? (How long does it take to complete a project, roughly?)
4. Nice charts of your earnings throughout the months.

All data are stored locally in your local storage system, so you don't need to
worry on providing your API token. To verify this, open "inspect element" feature
from your browser and record your network activity (view "Network" tab) as you enter some random API code or pulling 
review data.

## How To Use

To get started, run the following commands:
```
set_api [your Udacity API code]
pull_reviews [number of months]
list_reviews
report
```

Whenever you feel lost, just run `help` command to tell you what you can do next.
You may also run `help [command name]` to find out more details on a command.

## Help Needed!

This app was created by Udacity reviewers, for Udacity reviewers. This early version is currently quite a good addition to my own personal log, but togeher we can create an even better app.

1. I'm not much of a web designer. Currently all commands are done via console log, but it should be enough foundation to help you with building a kick-ass design. `$('#console').terminal().exec('[command_name] [parameters]')` can be called from code to run anything console log can do.
2. When running this on mobile, you can't even type into the console. Anyone willing to take on this and saves the day?
3. I think a statistic on what projects I have reviewed the most would be a wonderful reporting feature to add. Any taker?
4. I'm currently having a personal log in Google Spreadsheet. Sometimes I need to make some notes on the reviews. If there is a way to sync the data in this app with it that would be super awesome.

And there are still many ways to contribute, looking forward to work together with you!

## Development Notes

- To add new javascript plugin, run `bower install pluginname`.
- This project uses Foundation with Grunt, so when you need to update your css, cd to `static` dir and run `grunt`.
  You may then update the scss files and they will be compiled into app.css used in this app.
- Documentation is made with jsdoc with baseline plugin. To export documentation,
  first [install jsdoc-baseline node module](https://github.com/hegemonic/jsdoc-baseline) 
  `npm install --save-dev https://github.com/jsdoc3/jsdoc/tarball/master`
  then to compile the documentation run `jsdoc -c jsdoc-conf.json`.