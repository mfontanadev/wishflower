
module.exports = function(app)
{
	var wishFlowerService = null;
	if (__mockDB === true)
		wishFlowerService = require(__basePath + "/controllers/services/wishflower.ServiceMock.js");
	else
		wishFlowerService = require(__basePath + "/controllers/services/wishflower.Service.js");

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

	app.get ('/services/wishflowerGetByKeyPath', function (req, res)
		{
			var wish = req.query.keyPath;

			objWishFlowerService.wishflowerGetByKeyPath
			(
				wish,
				function(result) {res.send(result);}
			);
		});

		app.get ('/services/wishflowerGetByWish', function (req, res)
    {
        var id = req.query.wish;

        objWishFlowerService.wishflowerGetByWish
        (
            id,
            function(result) {res.send(result);}
        );
    });

    app.post ('/services/wishflowerAddWish', function (req, res)
    {
        var wish = req.query.wish;

        objWishFlowerService.wishflowerAddWish
        (
            wish,
            function(result) {res.send(result);}
        );
    });

	app.post ('/services/wishflowerAddById', function (req, res) 
		{
			var id = req.query.id;
			var wish = req.query.wish;

			objWishFlowerService.wishflowerAddById
			(
				id,
				wish,
				function(result) {res.send(result);}
			);
		});

			app.post ('/services/wishflowerAddByKeyPath', function (req, res)
    {
        var keyPath = req.query.keyPath;
        var wish = req.query.wish;

        objWishFlowerService.wishflowerAddByKeyPath
        (
            keyPath,
            wish,
            function(result) {res.send(result);}
        );
    });


}
