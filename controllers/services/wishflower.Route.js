
module.exports = function(app)
{
	var wishFlowerService = require(__basePath + "/controllers/services/wishflower.Service.js");
	var objWishFlowerService = new wishFlowerService();

	app.get ('/services/wishflowerGetAll', function (req, res) 
		{
			objWishFlowerService.wishflowerGetAll
			(
				function(result) {res.send(result);}
			);
		});

	app.get ('/services/wishflowerGetById', function (req, res) 
		{
			var id = req.query.id;

			objWishFlowerService.wishflowerGetById
			(
				id,
				function(result) {res.send(result);}
			);
		});
}
