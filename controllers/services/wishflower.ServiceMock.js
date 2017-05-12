//var req_db_wish_mock_schema = null;
var req_db_wish_mock = null;

if (typeof require != 'undefined')
{
	req_db_wish_mock = require(__basePath + "/models/db_wish_mock.js");
}

function WishflowerService() 
{ 
	this.m_db_wish = new req_db_wish_mock();
}

WishflowerService.prototype.init = function (_dbclient) 
{
	this.m_db_wish.initOnce(_dbclient);
}

WishflowerService.prototype.wishflowerGetAll = function (_callback) 
{
	this.m_db_wish.wishflowerGetAll(_callback);
}

WishflowerService.prototype.wishflowerGetById = function (_id, _callback)
{
	this.m_db_wish.wishflowerGetById(_id, _callback);
}

WishflowerService.prototype.wishflowerGetByKeyPath = function (_keyPath, _callback)
{
    this.m_db_wish.wishflowerGetByKeyPath(_keyPath, _callback);
}

WishflowerService.prototype.wishflowerGetByWish = function (_wish, _callback)
{
    this.m_db_wish.wishflowerGetByWish(_wish, _callback);
}

WishflowerService.prototype.wishflowerAddWish = function (_wish, _callback)
{
    this.m_db_wish.wishflowerAddWish(_wish, _callback);
}

WishflowerService.prototype.wishflowerAddById = function (_id, _wish, _callback)
{
	this.m_db_wish.wishflowerAddById(_id, _wish, _callback);
}

WishflowerService.prototype.wishflowerAddByKeyPath = function (_keyPath, _wish, _callback)
{
    this.m_db_wish.wishflowerAddByKeyPath(_keyPath, _wish, _callback);
}

WishflowerService.prototype.wishflowerClearTree = function (_callback)
{
    this.m_db_wish.wishflowerClearTree(_callback);
}

WishflowerService.prototype.dump = function ()
{
}

module.exports = WishflowerService;

