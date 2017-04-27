if (typeof require != "undefined")
{
}
function WishflowerServiceMock()
{
	this.m_wishes = null;

	WishflowerServiceMock.prototype.init = function (_dbclient)
	{
		this.initOnce(null);
	}

	WishflowerServiceMock.prototype.initOnce = function (_dbclient)
	{
		console.log("mock initOnce");

		var res = this.automaticWishEntryGenerator(global.__treeLeves, global.__treeFlowers);

		// Clear wish field.
		this.m_wishes = JSON.parse(res);
		for (var i = 0; i < this.m_wishes.length; i++)
		{
			if (i === 1)
				this.m_wishes[i].wish = 'WishTest';
		}
	}

	WishflowerServiceMock.prototype.automaticWishEntryGenerator = function (_levels, _flowersQty)
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

	WishflowerServiceMock.prototype.getHashKey = function (_levels, _finalPos, _flowerNum)
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


	WishflowerServiceMock.prototype.wishflowerGetAll = function (_callback)
	{
		console.log("mock wishflowerGetAll");

		var res = "";
		res = JSON.stringify(this.m_wishes);
		_callback(res);
	}

	WishflowerServiceMock.prototype.wishflowerGetById = function (_id, _callback)
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

	WishflowerServiceMock.prototype.wishflowerGetByKeyPath = function(_keyPath, _callback)
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

	WishflowerServiceMock.prototype.wishflowerGetByWish = function(_wish, _callback)
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

	WishflowerServiceMock.prototype.wishflowerAddWish = function (_wish, _callback)
	{
		console.log("mock wishflowerAddWish");	
	    var res = "";

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

	WishflowerServiceMock.prototype.wishflowerAddById = function (_id, _wish, _callback)
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

	WishflowerServiceMock.prototype.wishflowerAddByKeyPath = function (_keyPath, _wish, _callback)
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

	WishflowerServiceMock.prototype.wishflowerClearTree = function (_callback)
	{
		console.log("mock wishflowerClearTree");	
	    for (var i = 0; i < this.m_wishes.length; i++)
	    {
		    this.m_wishes[i].wish = "";
	    }

	    this.initOnce(null);
	    
	    _callback("");
	}

	WishflowerServiceMock.prototype.dump = function ()
	{
		console.log(this.m_wishes);
	}
}

module.exports = WishflowerServiceMock;
