module.exports = function(app)
{
	// MAIN CONTROLLERS
	app.get ('/models/userGetAll', 
		function (req, res) 
		{
			console.log(req.params);
			res.send('User Get All');
		});
}
