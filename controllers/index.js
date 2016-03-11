module.exports = function(app)
{
	// MAIN CONTROLLERS
	app.get ('/controllers/errorPageController.js', 
		function (req, res) {res.sendFile(__dirname + '/errorPageController.js');});

	app.get ('/controllers/wishflowerController.js', 
		function (req, res) {res.sendFile(__dirname + '/wishflowerController.js');});

	app.get ('/controllers/entities/flower.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/flower.js');});

	app.get ('/controllers/server/protocolMessages.js', 
		function (req, res) {res.sendFile(__dirname + '/server/protocolMessages.js');});

	// ENTITIES
	app.get ('/controllers/entities/requestMessages.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/requestMessages.js');});

	app.get ('/controllers/entities/treeNode.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/treeNode.js');});

	// HELPERS
	app.get ('/controllers/entities/keypair.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/keypair.js');});

	// SERVICES
	require('./services/wishflower.Route.js')(app);
	require('./services/errorPage.Route.js')(app);

	console.log("   controllers/index.js: OK");
}
