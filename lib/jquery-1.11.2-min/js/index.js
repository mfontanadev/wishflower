module.exports = function(app)
{
	app.get('/lib/jquery-1.11.2-min/js/jquery1.11.2jquery.min.js', 
		function (req, res) {res.sendFile(__dirname + '/jquery1.11.2jquery.min.js');});

	console.log("   lib/jquery-1.11.2-min/js/index.js: OK");
}
