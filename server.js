// Detect Params  http://nodejs.org/docs/latest/api/process.html#process.argv

if (process.argv.indexOf('--no-auth') > -1 ){
  /**
   * Indicates when to run without requiring auth for API
   */
   GLOBAL.no_auth = true;
}


var express = require('express'),
    /**
     * Instantiate the unique Express instance
     */
     app = module.exports = express();

/**
 * @type {Express}
 *
 * The Singleton of Express app instance
 */
 GLOBAL.app = app;

fs = require('fs');
eval(fs.readFileSync('settings.json', 'ascii'));

 var mysql = require('mysql');
 var connection_r = mysql.createConnection({
 	host : settings.mysql.host,
 	user : settings.mysql.user,
 	password : settings.mysql.password,
 	port : settings.mysql.port,
 	database : settings.mysql.database
 })

 GLOBAL.connection_r = connection_r;

// Configuration

app.configure(function() {
	app.use(express.logger({format: 'dev'}));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'evilWorldDom1nat10nPlanzisstillsmallshouldhaveNoWords' }));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.set('views', __dirname + '/views');
	app.engine('html', require('ejs').renderFile);
});

app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});


// Routes

require('./routes.js');


app.listen(8010);
console.log('Its is on !');
//console.log('Express server listening on port %d in %s mode',
//   app.address().port, app.settings.env);