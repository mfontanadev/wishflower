var express = require("express");
var app = express();
var port = (process.env.PORT || 5000 );
var url = require('url');

// config
var C_USE_MONGODB_OLD_CONNECTION_TYPE = false;
var C_USE_MLAB_DATABASE_HOST = true;

// Global definitions
global.__basePath = __dirname;
global.__mockDB = false;
global.__dbClient = null;
global.__services = null;

var reqGlobals = require('./config/globalDefinitions.js'); 
global.__configDefinitions = new reqGlobals();

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

// SERVICES
var reqServiceRoute = require('./controllers/services/wishflower.Route.js');
global.__services = new reqServiceRoute(app); 

// Database 
console.log('');
console.log('Database initializing.');
if (global.__mockDB === false)
{
	var mongodb = require('mongodb');
	var version = mongodb.version;
	console.log("version");
	console.log(version);

	if (C_USE_MONGODB_OLD_CONNECTION_TYPE === true)
	{
		var server = new mongodb.Server("127.0.0.1", 27017, {});
		var dbBaseTest = new mongodb.Db('wishFlowerDB', server, {});
		dbBaseTest.open
		(
			function (error, client) 
			{
				global.__dbClient = client;

				if (typeof global.__dbClient !== 'undefined' && global.__dbClient !== null)
				{
					global.__services.getInstance().init(global.__dbClient);
					console.log('Database initialized.');
				}
				else
				{
					console.log('Database error:' + error);
				}
			}
		);
	}
	else
	{
		
		var mongoClient = mongodb.MongoClient;
		var urlDB = "";

		if (C_USE_MLAB_DATABASE_HOST === true)
		{
			urlDB = "mongodb://wishflowerdb_admin:wishflowerdb_pass@wishflowerdb-shard-00-00.r9dxy.mongodb.net:27017,wishflowerdb-shard-00-01.r9dxy.mongodb.net:27017,wishflowerdb-shard-00-02.r9dxy.mongodb.net:27017/wishflowerdb?ssl=true&replicaSet=atlas-n9ipyy-shard-0&authSource=admin&retryWrites=true&w=majority";
		}
		else
		{
			urlDB = "mongodb://localhost:27017/wishflowerdb"
		}

		mongoClient.connect
		(
			urlDB, 
			function (error, client) 
			{
				global.__dbClient = client;

				if (typeof global.__dbClient !== 'undefined' && global.__dbClient !== null)
				{
					global.__services.getInstance().init(global.__dbClient);
					console.log('Database initialized. Connection established to ' + urlDB);
				}
				else
				{
					console.log('Database error:' + error);
				}
			}
		);

		/*

		var  uri = "mongodb+srv://wishflowerdb_admin:wishflowerdb_pass@wishflowerdb.r9dxy.mongodb.net/wishflowerdb?retryWrites=true&w=majority";
	  	const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });
	  	var usersCollection = "wish";

		  client.connect
		  (
		  	err => {
		    			if (err) return callback(err);

		    			const collection = client.db(dbName).collection(usersCollection);

					    collection.findOne({keyPath: "<<<<<<2"}, (err, user) => 
					    {
		      				if (err) return callback(err);
		      				if (!user) return callback("User not found.");
					      callback(null, profile);
		      				client.close();
		    			});
		  			}
		  	);*/

	}
}
else
{
	global.__services.getInstance().init(null);
	console.log('Database initialized (mock).');
}

// Start socket listening.
console.log('');
var io = require('socket.io').listen(app.listen(port));
console.log("SOCKETIO: listening on port " + port );

if (typeof io === 'undefined')
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

