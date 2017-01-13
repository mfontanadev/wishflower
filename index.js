var express = require("express");
var app = express();
var port = (process.env.PORT || 5000 );
var url = require('url');

// Global definitions
global.__basePath = __dirname;
global.__mockDB = true;

// Entry point.
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/views/' + 'wishflowerView.html');
});

app.get ('/favicon.ico', function (req, res) {
		res.send('/public/favicon.ico');
});

// Routes
require('./views')(app);
require('./controllers')(app);
require('./models')(app);

require('./lib/chel-dist')(app);
require('./lib/sound-0.6.1-dist/js')(app);
require('./lib/jquery-1.11.2-min/js')(app);
require('./config')(app);

app.use(express.static(__dirname + '/public/assets/img'));
app.use(express.static(__dirname + '/public/assets/snd'));

// Database 
var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {});
var dbBaseTest = new mongodb.Db('baseTest', server, {})
dbBaseTest.open
(
	function (error, client) 
	{
		global.__dbClient = client;
	}
);

// Start socket listening.
var io = require('socket.io').listen(app.listen(port));
console.log("SOCKETIO: listening on port " + port );

if (typeof io !== 'undefined')
{
	// Start socket server.
	var reqServer = require("./controllers/server/serverOrchesta.js");
	var reqServerInstance = new reqServer();  
	reqServerInstance.initWithAppPortIO(app, port, io);
	reqServerInstance.start(io);
	console.log("SERVER: started");
}
else
{
	app.listen
	(
		port, 
		function() 
		{
			console.log('LISTEN: listening on port ' + port);
		}
	);
}

// Test initial wish update.

