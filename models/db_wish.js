db_wish.COLLECTION_NAME = "wish";

function db_wish()
{
	db_wish.prototype.initOnce = function(_dbclient)
	{		
		console.log("mongo initOnce");
	 	var collection = _dbclient.collection(db_wish.COLLECTION_NAME);
		collection.drop();

		var res = this.automaticWishEntryGenerator(
			global.__configDefinitions.get_C_TREE_LEVELS(), 
			global.__configDefinitions.get_C_TREE_FLOWERS());

		// Clear wish field.
		var docs = JSON.parse(res);
		for (var i = 0; i < docs.length; i++)
		{
			if (i === 1)
				docs[i].wish = 'WishTest';

			collection.insertOne({keyPath : docs[i].keyPath, wish: docs[i].wish});
		}
	}

	db_wish.prototype.automaticWishEntryGenerator = function (_levels, _flowersQty)
	{
		var res = "";
		
		res += '[';

		// Generate in between data.
		var levels = _levels;
		var flowersQty = _flowersQty;
		var totalIterations = Math.pow(2, levels); 

		for (var i = 0; i < totalIterations; i++)
		{
			for (var li = 1; li <= flowersQty; li++)
			{
				keyPath = this.getHashKey(_levels, i, li);
		
				res += '{ "_id" : "000", "keyPath" : "' + keyPath + '", "wish" : "" }';
				
				// Avoid add last ",".
				if (li !== flowersQty || i !== totalIterations - 1)
					res += ',';
			}
		}

		res += ']';

		return res;
	}

	db_wish.prototype.getHashKey = function (_levels, _finalPos, _flowerNum)
	{
	    var result = "";

	    var binary = _finalPos.toString(2);

	    // Pad with 0.
	    var binaryPadded = binary + "";
	    while (binaryPadded.length < _levels) binaryPadded = "0" + binaryPadded;

	    // Replace 0 by > and 1 by <
	    var binaryPaddedReplaced = binaryPadded.replace(/0/g, ">").replace(/1/g, "<");

	    // Add number of leave.
	    result = binaryPaddedReplaced + _flowerNum;

	    return result;
	}


	db_wish.prototype.wishflowerGetAll = function(_callback)
	{
		console.log("mongo wishflowerGetAll");

	 	var collection = __dbClient.collection(db_wish.COLLECTION_NAME);

		collection
		.find()
		.toArray
		(
			function(err, docs) 
			{
			    _callback(JSON.stringify(docs));
			}
		);
	}

	db_wish.prototype.wishflowerGetById = function(_id, _callback) 
	{
		console.log("mongo wishflowerGetById");

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
		console.log("mongo wishflowerGetByKeyPath");
        // Pending implmentation.
    }

    db_wish.prototype.wishflowerGetByWish = function(_wish, _callback)
    {
		console.log("mongo wishflowerGetByWish");
        // Pending implmentation.
    }

    db_wish.prototype.wishflowerAddWish = function(_wish, _callback)
    {
		console.log("mongo wishflowerAddWish");

		var res = "";		
    	var _self = this;
	 	var collection = __dbClient.collection(db_wish.COLLECTION_NAME);

		if (_wish === "cleartree")
		{
			console.log("before clear");
			this.wishflowerClearTree(_callback);
		}
		else
		{
			console.log("adding wish");

			collection
			.find()
			.toArray
			(
				function(err, docs) 
				{
				    // Find an empty wishflower to hold our incomming wish.
				    for (var i = 0; i < docs.length; i++)
				    {
				        if (docs[i].wish === '')
				        {
				            docs[i].wish = _wish;
				            res = '[' + JSON.stringify(docs[i]) + ']';

				            // Update database with new wish. 
					       	_self.wishflowerAddByKeyPath(docs[i].keyPath, docs[i].wish, null);
				            break;
				        }
				    }

				    _callback(res);
				}
			);
		}
    }

	db_wish.prototype.wishflowerAddById = function(_id, _wish, _callback) 
	{
		console.log("mongo wishflowerAddById");
	}

    db_wish.prototype.wishflowerAddByKeyPath = function(_keyPath, _wish, _callback)
    {
		console.log("mongo wishflowerAddByKeyPath");

	 	var collection = __dbClient.collection(db_wish.COLLECTION_NAME);
		var result = null; 

		result = collection.update
		(
		   { keyPath: _keyPath},
		   {
		      keyPath: _keyPath,
		      wish: _wish
		   }
		)

		console.log("find:" + _keyPath  +", wish:" + _wish + ", result:" + result);
    }

    db_wish.prototype.wishflowerClearTree = function(_callback)
    {
		console.log("mongo wishflowerClearTree");

	 	var collection = __dbClient.collection(db_wish.COLLECTION_NAME);

		this.initOnce(__dbClient);

		_callback("");
    }

    db_wish.prototype.dump = function()
    {
		console.log("mongo dump");
    }
}

module.exports = db_wish;



