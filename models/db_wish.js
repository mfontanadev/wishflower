db_wish.COLLECTION_NAME = "wish";

function db_wish()
{
	db_wish.prototype.initOnce = function(_dbclient)
	{		
		//console.log("initOnce");
	 	var collection = _dbclient.collection(db_wish.COLLECTION_NAME);
		collection.drop();

		var res = "";
		res += '[';
		res += '{"keyPath" : ">>>1", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : ">>>2", "wish" : "WishTest" }';
		res += ',';
		res += '{"keyPath" : ">><1", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : ">><2", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "><>1", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "><>2", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "><<1", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "><<2", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "<>>1", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "<>>2", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "<><1", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "<><2", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "<<>1", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "<<>2", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "<<<1", "wish" : "" }';
		res += ',';
		res += '{"keyPath" : "<<<2", "wish" : "" }';
		res += ']';

		// Clear wish field.
		var docs = JSON.parse(res);
		for (var i = 0; i < docs.length; i++)
		{
			collection.insertOne({keyPath : docs[i].keyPath, wish: docs[i].wish});
		}

		//console.log("test update");
		//this.wishflowerAddByKeyPath(">>>2", "updated", null);
	}

	db_wish.prototype.wishflowerGetAll = function(_callback)
	{
		//console.log("mongo wishflowerGetAll");

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
    	var _self = this;
		console.log("mongo wishflowerAddWish");

	 	var collection = __dbClient.collection(db_wish.COLLECTION_NAME);

       	//_self.wishflowerAddByKeyPath(">>>1", _wish, null);

		collection
		.find()
		.toArray
		(
			function(err, docs) 
			{
			    var res = "";

			    // Find an empty wishflower to hold our incomming wish.
			    for (var i = 0; i < docs.length; i++)
			    {
			        if (docs[i].wish === '')
			        {
				       	_self.wishflowerAddByKeyPath(docs[i].keyPath, _wish + "doc", null);
			            docs[i].wish = _wish;
			            res = '[' + JSON.stringify(docs[i]) + ']';
			            break;
			        }
			    }

			    _callback(res);
			}
		);
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
		console.log("find:" + _keyPath  +", wish:" + _wish);
		console.log(result);
    }

    db_wish.prototype.wishflowerClearTree = function(_callback)
    {
		console.log("mongo wishflowerClearTree");

	 	var collection = __dbClient.collection(db_wish.COLLECTION_NAME);

		this.initOnce(__dbClient);

		_callback("");
    }
}

module.exports = db_wish;



