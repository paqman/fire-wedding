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

var connection_rw = mysql.createConnection({
 	host : settings.mysql.host,
 	user : settings.mysql.user_rw,
 	password : settings.mysql.password_rw,
 	port : settings.mysql.port,
 	database : settings.mysql.database
 }) 

 GLOBAL.connection_r = connection_r;
 GLOBAL.connection_rw = connection_rw;

// Configuration

app.configure(function() {
	app.use(express.logger({format: 'dev'}));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'my0verHudgeC00k13S3cretPa55w0rd0fTh3D3athWithBatman', cookie : { maxAge : 1000 * 60 * 20 } }));
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

app.param(function(name, fn){
	if(fn instanceof RegExp){
		return function(req, res, next, val){
			var captures;
			if(captures = fn.exec(String(val))){
				req.params[name] = captures;
				next();
			}else{
				next('route');
			}
		}
	}
});

app.param('id', /^\d+$/);

// Routes
require('./routes.js');



app.listen(8010);
console.log('Its is on !');
//console.log('Express server listening on port %d in %s mode',
//   app.address().port, app.settings.env);