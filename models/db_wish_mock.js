db_wish_mock.COLLECTION_NAME = "wish";

function db_wish_mock()
{
	this.m_wishes = null;

	db_wish_mock.prototype.initOnce = function(_dbclient)
	{		
		console.log("mock initOnce");

		var res = this.automaticWishEntryGenerator(
			global.__configDefinitions.get_C_TREE_LEVELS(), 
			global.__configDefinitions.get_C_TREE_FLOWERS());

		// Clear wish field.
		this.m_wishes = JSON.parse(res);
		for (var i = 0; i < this.m_wishes.length; i++)
		{
			if (i === 1)
				this.m_wishes[i].wish = 'WishTest';
		}
	}

	db_wish_mock.prototype.automaticWishEntryGenerator = function (_levels, _flowersQty)
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

	db_wish_mock.prototype.getHashKey = function (_levels, _finalPos, _flowerNum)
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


	db_wish_mock.prototype.wishflowerGetAll = function(_callback)
	{
		console.log("mock wishflowerGetAll");

		var res = "";
		res = JSON.stringify(this.m_wishes);
		_callback(res);
	}

	db_wish_mock.prototype.wishflowerGetById = function(_id, _callback) 
	{
		console.log("mock wishflowerGetById");

		var res = "";

		for (var i = 0; i < this.m_wishes.length; i++)
		{
			if (this.m_wishes[i]._id === _id)
			{
				res = '[' + JSON.stringify(this.m_wishes[i]) + ']';
			}
		}

		_callback(res);
	}

    db_wish_mock.prototype.wishflowerGetByKeyPath = function(_keyPath, _callback)
    {
		console.log("mock wishflowerGetByKeyPath");	
	    var res = "";

	    for (var i = 0; i < this.m_wishes.length; i++)
	    {
	        if (this.m_wishes[i].keyPath === _keyPath)
	        {
	            res = '[' + JSON.stringify(this.m_wishes[i]) + ']';
	        }
	    }

	    _callback(res);
    }

    db_wish_mock.prototype.wishflowerGetByWish = function(_wish, _callback)
    {
		console.log("mock wishflowerGetByWish");	
	    var res = "";

	    for (var i = 0; i < this.m_wishes.length; i++)
	    {
	        if (this.m_wishes[i].wish === _wish)
	        {
	            res = '[' + JSON.stringify(this.m_wishes[i]) + ']';
	        }
	    }

	    _callback(res);
    }

    db_wish_mock.prototype.wishflowerAddWish = function(_wish, _callback)
    {
		console.log("mock wishflowerAddWish");	
		
		var res = "";		
		if (_wish === "cleartree")
		{
			console.log("before clear");
			this.wishflowerClearTree(_callback);
		}
		else
		{
			console.log("adding wish");

		    // Find an empty wishflower to hold our incomming wish.
		    for (var i = 0; i < this.m_wishes.length; i++)
		    {
		        if (this.m_wishes[i].wish === '')
		        {
		            this.m_wishes[i].wish = _wish;
		            res = '[' + JSON.stringify(this.m_wishes[i]) + ']';
		            break;
		        }
		    }

		    _callback(res);
		}
    }

	db_wish_mock.prototype.wishflowerAddById = function(_id, _wish, _callback) 
	{
		console.log("mock wishflowerAddById");	
		var res = "";

		for (var i = 0; i < this.m_wishes.length; i++)
		{
			if (this.m_wishes[i]._id === _id)
			{
				this.m_wishes[i].wish = _wish;
				res = '[' + JSON.stringify(this.m_wishes[i]) + ']';
			}
		}

		_callback(res);
	}

    db_wish_mock.prototype.wishflowerAddByKeyPath = function(_keyPath, _wish, _callback)
    {
		console.log("mock wishflowerAddByKeyPath");	
	    var res = "";

	    for (var i = 0; i < this.m_wishes.length; i++)
	    {
	        if (this.m_wishes[i].keyPath === _keyPath)
	        {
	            this.m_wishes[i].wish = _wish;
	            res = '[' + JSON.stringify(this.m_wishes[i]) + ']';
	        }
	    }

		console.log("find:" + _keyPath  +", wish:" + _wish);

	    _callback(res);
    }

    db_wish_mock.prototype.wishflowerClearTree = function(_callback)
    {
		console.log("mock wishflowerClearTree");	
	    for (var i = 0; i < this.m_wishes.length; i++)
	    {
		    this.m_wishes[i].wish = "";
	    }

	    this.initOnce(null);
	    
	    _callback("");
    }

    db_wish_mock.prototype.dump = function()
    {
    	console.log(this.m_wishes);
    }
}

module.exports = db_wish_mock;



