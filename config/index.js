module.exports = function(app)
{
	app.get ('/config/globalDefinitions.js', 
		function (req, res) {res.sendFile(__dirname + '/globalDefinitions.js');});

	console.log("   config/index.js: OK");
}