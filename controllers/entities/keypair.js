function KeyPair() 
{ 
	this.m_key = null;
	this.m_value = null;
}

KeyPair.prototype.initWith = function (_key, _pair)
{
	this.m_key = _key;
	this.m_value = _pair;
};

KeyPair.prototype.getKey = function ()
{
	return this.m_key;
};

KeyPair.prototype.setKey = function (_key)
{
	this.m_key = _key;
};

KeyPair.prototype.getValue = function ()
{
	return this.m_value;
};

KeyPair.prototype.setValue = function (_value)
{
	this.m_value = _value;
};

KeyPair.prototype.toString = function ()
{
	var tmpResult = "KeyPair:";
	tmpResult = tmpResult + "{";
	tmpResult = tmpResult + "m_key=" + this.m_key + ",";
	tmpResult = tmpResult + "m_value=" + this.m_value;
	tmpResult = tmpResult + "}";
	return tmpResult;
};

if (typeof module !== 'undefined' && module !== null)
{
	module.exports = KeyPair;
}

