module.exports = function(app)
{
	app.get('/errorPageView.html', 
		function (req, res) {res.sendFile(__dirname + '/errorPageView.html');});

	console.log("   views/index.js: OK");
}
