WishflowerLadybugTestActivity.self

function WishflowerLadybugTestActivity(_id, _viewParent) 
{ 
	WishflowerLadybugTestActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_ladybug = null;
};

WishflowerLadybugTestActivity.prototype.initialize = function ()
{
	console.log("WishflowerLadybugTestActivity");

	this.m_ladybug = new Ladybug();
	this.m_ladybug.initWithType(this.m_viewParent, Ladybug.C_LADYBUG_TYPE_WISHMASTER);

	this.createControls();
};

WishflowerLadybugTestActivity.prototype.createControls = function ()
{
};

WishflowerLadybugTestActivity.prototype.onEnterActivity = function ()
{
};

WishflowerLadybugTestActivity.prototype.handleInputs = function ()
{
	this.m_ladybug.handleInputs();
};

WishflowerLadybugTestActivity.prototype.implementGameLogic = function ()
{
	this.m_ladybug.implementGameLogic();
};

WishflowerLadybugTestActivity.prototype.render = function ()
{
	this.m_ladybug.render();

	this.renderControls();
};

WishflowerLadybugTestActivity.prototype.renderControls = function ()
{
};

WishflowerLadybugTestActivity.prototype.onLeaveActivity = function ()
{
};