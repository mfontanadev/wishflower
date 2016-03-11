module.exports = function(app)
{
	// MAIN CONTROLLERS
	app.get ('/services/errorPageGetAll', 
		function (req, res) 
		{
			res.send('/services/errorPageGetAll');
		});

	// MAIN CONTROLLERS
	app.get ('/services/errorPageGetById', 
		function (req, res) 
		{
			res.send('/services/errorPageGetById');
		});
}
