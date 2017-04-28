function WishflowerServiceRoute(app) 
{ 
	objWishFlowerService = null;
	reqWishFlowerService = null;

	if (__mockDB === true)
	{
		reqWishFlowerService = require(__basePath + "/controllers/services/wishflower.ServiceMock.js");
	}
	else
	{
		reqWishFlowerService = require(__basePath + "/controllers/services/wishflower.Service.js");
	}
	objWishFlowerService = new reqWishFlowerService();

	app.get ('/services/wishflowerGetAll', function (req, res) 
		{
			objWishFlowerService.wishflowerGetAll
			(
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

	WishflowerServiceRoute.prototype.getInstance = function () 
	{
		return objWishFlowerService;
	}
}

module.exports = WishflowerServiceRoute;


