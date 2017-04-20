if (typeof require != "undefined")
{
}

function WishflowerServiceMock()
{
	this.m_servicesCount = 0;

	var res = "";
	res += '[';
	res += '{ "_id" : "000", "keyPath" : ">>>1", "wish" : ">>>1w000" }';
	res += ',';
	res += '{ "_id" : "001", "keyPath" : ">>>2", "wish" : ">>>2w001" }';
	res += ',';
	res += '{ "_id" : "002", "keyPath" : ">><1", "wish" : ">><1w002" }';
	res += ',';
	res += '{ "_id" : "003", "keyPath" : ">><2", "wish" : ">><2w003" }';
	res += ',';
	res += '{ "_id" : "004", "keyPath" : "><>1", "wish" : "><>1w004" }';
	res += ',';
	res += '{ "_id" : "005", "keyPath" : "><>2", "wish" : "><>2w005" }';
	res += ',';
	res += '{ "_id" : "006", "keyPath" : "><<1", "wish" : "><<1w006" }';
	res += ',';
	res += '{ "_id" : "007", "keyPath" : "><<2", "wish" : "><<2w007" }';
	res += ',';
	res += '{ "_id" : "008", "keyPath" : "<>>1", "wish" : "<>>1w008" }';
	res += ',';
	res += '{ "_id" : "009", "keyPath" : "<>>2", "wish" : "<>>2w009" }';
	res += ',';
	res += '{ "_id" : "010", "keyPath" : "<><1", "wish" : "<><1w010" }';
	res += ',';
	res += '{ "_id" : "011", "keyPath" : "<><2", "wish" : "<><2w011" }';
	res += ',';
	res += '{ "_id" : "012", "keyPath" : "<<>1", "wish" : "<<>1w012" }';
	res += ',';
	res += '{ "_id" : "013", "keyPath" : "<<>2", "wish" : "<<>2w013" }';
	res += ',';
	res += '{ "_id" : "014", "keyPath" : "<<<1", "wish" : "<<<1w014" }';
	res += ',';
	res += '{ "_id" : "015", "keyPath" : "<<<2", "wish" : "<<<2w015" }';
	res += ']';

	// Clear wish field.
	this.m_wishes = JSON.parse(res);
	for (var i = 0; i < this.m_wishes.length; i++)
	{
		if (i !== 1)
			this.m_wishes[i].wish = '';
	}
}

WishflowerServiceMock.prototype.wishflowerGetAll = function (_callback)
{
	var res = "";
	res = JSON.stringify(this.m_wishes);
	_callback(res);
}

WishflowerServiceMock.prototype.wishflowerGetById = function (_id, _callback)
{
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
    var res = "";

    for (var i = 0; i < this.m_wishes.length; i++)
    {
        if (this.m_wishes[i].keyPath === _keyPath)
        {
            this.m_wishes[i].wish = _wish;
            res = '[' + JSON.stringify(this.m_wishes[i]) + ']';
        }
    }

    _callback(res);
}

WishflowerServiceMock.prototype.wishflowerClearTree = function (_callback)
{
    var res = "";

    for (var i = 0; i < this.m_wishes.length; i++)
    {
	    this.m_wishes[i].wish = "";
    }

    _callback(res);
}

WishflowerServiceMock.prototype.dump = function ()
{
	console.log(this.m_servicesCount);
}

module.exports = WishflowerServiceMock;
