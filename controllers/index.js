module.exports = function(app)
{
	// CONTEXTS

	// ACTIVITIES
	app.get ('/controllers/activities/wishflowerPlayActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerPlayActivity.js');});

	// MAIN CONTROLLERS
	app.get ('/controllers/errorPageController.js', 
		function (req, res) {res.sendFile(__dirname + '/errorPageController.js');});

	app.get ('/controllers/wishflowerController.js', 
		function (req, res) {res.sendFile(__dirname + '/wishflowerController.js');});

	app.get ('/controllers/wishflowerContext.js', 
		function (req, res) {res.sendFile(__dirname + '/wishflowerContext.js');});

	app.get ('/controllers/server/protocolMessages.js', 
		function (req, res) {res.sendFile(__dirname + '/server/protocolMessages.js');});

	// ENTITIES
	app.get ('/controllers/entities/requestMessages.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/requestMessages.js');});

	app.get ('/controllers/entities/treeNode.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/treeNode.js');});

	app.get ('/controllers/entities/bitmapFilter.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/bitmapFilter.js');});

	// HELPERS
	app.get ('/controllers/entities/keypair.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/keypair.js');});

	// FLOWS

	// SERVICES
	require('./services/wishflower.Route.js')(app);

	console.log("   controllers/index.js: OK");
}
