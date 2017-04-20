function db_wish()
{
	db_wish.prototype.wishflowerGetAll = function(_callback)
	{
	 	var collection = __dbClient.collection('wishes');

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
		.find({'keyPath': _id})
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

    db_wish.prototype.wishflowerGetByKeyPath = function(_keyPath, _callback)
    {
        // Pending implmentation.
    }

    db_wish.prototype.wishflowerGetByWish = function(_wish, _callback)
    {
        // Pending implmentation.
    }

    db_wish.prototype.wishflowerAddWish = function(_wish, _callback)
    {
        // Pending implmentation.
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

    db_wish.prototype.wishflowerAddByKeyPath = function(_keyPath, _wish, _callback)
    {
        // Pending implmentation.
    }

    db_wish.prototype.wishflowerClearTree = function(_callback)
    {
        // Pending implmentation.
    }

}

module.exports = db_wish;



