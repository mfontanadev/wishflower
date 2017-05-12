module.exports = function(app)
{
	// ACTIVITIES
	app.get ('/controllers/activities/wishflowerPlayActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerPlayActivity.js');});

	app.get ('/controllers/activities/wishflowerHelpActivity.js', 
		function (req, res) {res.sendFile(__dirname + '/activities/wishflowerHelpActivity.js');});

    app.get ('/controllers/activities/wishflowerIntroActivity.js',
        function (req, res) {res.sendFile(__dirname + '/activities/wishflowerIntroActivity.js');});

	// FLOWS
	app.get ('/controllers/flows/playFlow.js', 
		function (req, res) {res.sendFile(__dirname + '/flows/playFlow.js');});

	app.get ('/controllers/flows/helpFlow.js', 
		function (req, res) {res.sendFile(__dirname + '/flows/helpFlow.js');});

    app.get ('/controllers/flows/introFlow.js',
        function (req, res) {res.sendFile(__dirname + '/flows/introFlow.js');});

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

	console.log("   controllers/index.js: OK");
}
