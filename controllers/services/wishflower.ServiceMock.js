if (typeof require != "undefined")
{
}

function WishflowerServiceMock() 
{ 
	this.m_servicesCount = 0;

	var res = "";
	res += '[';	
	res += '{ "_id" : "000", "keyPath" : ">>1", "wish" : ">>1w1" }';
	res += ',';
	res += '{ "_id" : "001", "keyPath" : ">>2", "wish" : ">>2w2" }';
	res += ',';
	res += '{ "_id" : "002", "keyPath" : "><1", "wish" : "><1w3" }';
	res += ',';
	res += '{ "_id" : "003", "keyPath" : "><2", "wish" : "><2w4" }';
	res += ',';
	res += '{ "_id" : "004", "keyPath" : "<>1", "wish" : "<>1w5" }';
	res += ',';
	res += '{ "_id" : "005", "keyPath" : "<>2", "wish" : "<>2w6" }';
	res += ',';
	res += '{ "_id" : "006", "keyPath" : "<<1", "wish" : "<<1w7" }';
	res += ',';
	res += '{ "_id" : "007", "keyPath" : "<<2", "wish" : "<<2w8" }';
	res += ']';

	this.m_wishes = JSON.parse(res);
	for (var i = 0; i < this.m_wishes.length; i++) 
	{
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
		if (this.m_wishes[i].keyPath === _id)
		{
			res = '[' + JSON.stringify(this.m_wishes[i]) + ']'; 
		}
	}

	_callback(res);
}

WishflowerServiceMock.prototype.wishflowerAddById = function (_id, _wish, _callback)
{
	var res = "";

	for (var i = 0; i < this.m_wishes.length; i++) 
	{
		if (this.m_wishes[i].keyPath === _id)
		{
			this.m_wishes[i].wish = _wish; 
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

WishflowerServiceMock.prototype.dump = function ()
{
	console.log(this.m_servicesCount);
}

module.exports = WishflowerServiceMock;
