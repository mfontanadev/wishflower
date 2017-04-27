module.exports = function(app)
{
	// ACTIVITIES
	app.get ('/controllers/activities/wishflowerPlayActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerPlayActivity.js');});

	app.get ('/controllers/activities/wishflowerAboutActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerAboutActivity.js');});

	app.get ('/controllers/activities/wishflowerLadybugTestActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerLadybugTestActivity.js');});

	app.get ('/controllers/activities/wishflowerMenuActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerMenuActivity.js');});

	app.get ('/controllers/activities/wishflowerHelpActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerHelpActivity.js');});

	app.get ('/controllers/activities/wishflowerLadybugWalkingPathActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerLadybugWalkingPathActivity.js');});

	app.get ('/controllers/activities/wishflowerImageFilterTestActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerImageFilterTestActivity.js');});

	app.get ('/controllers/activities/wishflowerLadybugFlyingPathActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerLadybugFlyingPathActivity.js');});

    app.get ('/controllers/activities/wishflowerIntroActivity.js',
        function (req, res) {res.sendFile(__dirname + '/activities/wishflowerIntroActivity.js');});

	app.get ('/controllers/activities/wishflowerInputControlsActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerInputControlsActivity.js');});

    // MAIN CONTROLLERS
	app.get ('/controllers/errorPageController.js', 
		function (req, res) {res.sendFile(__dirname + '/errorPageController.js');});

	app.get ('/controllers/wishflowerController.js', 
		function (req, res) {res.sendFile(__dirname + '/wishflowerController.js');});

	app.get ('/controllers/wishflowerContext.js', 
		function (req, res) {res.sendFile(__dirname + '/wishflowerContext.js');});

	// ENTITIES
	app.get ('/controllers/entities/treeNode.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/treeNode.js');});

	app.get ('/controllers/entities/ladybug.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/ladybug.js');});

	app.get ('/controllers/entities/bitmapFilter.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/bitmapFilter.js');});

	app.get ('/controllers/entities/animation.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/animation.js');});

	app.get ('/controllers/entities/poligonPath.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/poligonPath.js');});

	app.get ('/controllers/entities/background.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/background.js');});

	app.get ('/controllers/entities/garden.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/garden.js');});

	app.get ('/controllers/entities/inputControl.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/inputControl.js');});

    app.get ('/controllers/entities/keyPathControl.js',
        function (req, res) {res.sendFile(__dirname + '/entities/keyPathControl.js');});

    app.get ('/controllers/entities/messageControl.js',
        function (req, res) {res.sendFile(__dirname + '/entities/messageControl.js');});

    // FLOWS
	app.get ('/controllers/entities/introFlow.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/introFlow.js');});

	app.get ('/controllers/entities/helpFlow.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/helpFlow.js');});

	app.get ('/controllers/entities/playFlow.js', 
		function (req, res) {res.sendFile(__dirname + '/entities/playFlow.js');});

	// SERVICES
	require('./services/wishflower.Route.js')(app);

	console.log("   controllers/index.js: OK");
}
