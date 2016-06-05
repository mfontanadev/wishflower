function db_wish()
{
	db_wish.prototype.wishflowerGetAll = function(_callback) 
	{
	 	var collection = __dbClient.collection('personas');
		
		collection
		.find()
		.toArray
		(
			function(err, docs) 
			{
				console.log("");
				console.log(docs);
			    _callback(docs);
			}
		);
	}

	db_wish.prototype.wishflowerGetById = function(_id, _callback) 
	{
		var collection = __dbClient.collection('personas');
		
		collection
		.find({'nombre': 'pepe'})
		.toArray
		(
			function(err, docs) 
			{
				console.log("");
				console.log(docs);
				_callback(docs);
			}
		);
	}

	db_wish.prototype.wishflowerAddById = function(_id, _wish, _callback) 
	{
		var collection = __dbClient.collection('personas');
		
		collection
		.find({'nombre': 'pepe'})
		.toArray
		(
			function(err, docs) 
			{
				console.log("");
				console.log(docs);
				_callback(docs);
			}
		);
	}

	db_wish.prototype.wishflowerAddWish = function(_wish, _callback) 
	{
		// Pending implmentation.
	}
}

module.exports = db_wish;



