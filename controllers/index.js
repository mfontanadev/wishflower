module.exports = function(app)
{
	// CONTEXTS

	// ACTIVITIES
	app.get ('/controllers/activities/wishflowerPlayActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerPlayActivity.js');});

	app.get ('/controllers/activities/wishflowerAboutActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerAboutActivity.js');});

	app.get ('/controllers/activities/wishflowerLadybugTestActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerLadybugTestActivity.js');});

	app.get ('/controllers/activities/wishflowerMenuActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerMenuActivity.js');});

	app.get ('/controllers/activities/wishflowerHelpTestActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerHelpTestActivity.js');});

	// MAIN CONTROLLERS
	app.get ('/controllers/errorPageController.js', 
		function (req, res) {res.sendFile(__dirname + '/errorPageController.js');});

	app.get ('/controllers/wishflowerController.js', 
		function (req, res) {res.sendFile(__dirname + '/wishflowerController.js');});

	app.get ('/controllers/wishflowerContext.js', 
		function (req, res) {res.sendFile(__dirname + '/wishflowerContext.js');});

	app.get ('/controllers/wishflowerContext.js', 
		function (req, res) {res.sendFile(__dirname + '/wishflowerContext.js');});

	app.get ('/controllers/entities/flower.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/flower.js');});

	app.get ('/controllers/server/protocolMessages.js', 
		function (req, res) {res.sendFile(__dirname + '/server/protocolMessages.js');});

	// ENTITIES
	app.get ('/controllers/entities/requestMessages.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/requestMessages.js');});

	app.get ('/controllers/entities/treeNode.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/treeNode.js');});

	app.get ('/controllers/entities/ladybug.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/ladybug.js');});

	app.get ('/controllers/entities/bitmapFilter.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/bitmapFilter.js');});

	app.get ('/controllers/entities/animation.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/animation.js');});

	// HELPERS
	app.get ('/controllers/entities/keypair.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/keypair.js');});

	// SERVICES
	require('./services/wishflower.Route.js')(app);
	require('./services/errorPage.Route.js')(app);

	console.log("   controllers/index.js: OK");
}
