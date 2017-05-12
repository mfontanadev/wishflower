WishflowerPlayActivity.self = null;

function WishflowerPlayActivity(_id, _viewParent) 
{ 
	WishflowerPlayActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_flow = null;
};

WishflowerPlayActivity.prototype.getActivityName = function ()
{   
	return "WishflowerPlayActivity";
}

WishflowerPlayActivity.prototype.initialize = function ()
{   
	console.log(this.getActivityName());

	this.m_flow = new PlayFlow();
	this.m_flow.init(this.m_viewParent, this);

	this.createControls();
};

WishflowerPlayActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;
};

WishflowerPlayActivity.prototype.onEnterActivity = function ()
{
	this.m_flow.setState(PlayFlow.C_PLAY_FLOW_APPSTATE_INITIALIZING);
};

WishflowerPlayActivity.prototype.handleInputs = function ()
{
	this.m_flow.handleInputs();
};

WishflowerPlayActivity.prototype.implementGameLogic = function ()
{
	this.m_flow.implementGameLogic();
};

WishflowerPlayActivity.prototype.render = function ()
{
	this.m_flow.render();

	this.renderControls();
};

WishflowerPlayActivity.prototype.renderControls = function ()
{
};

WishflowerPlayActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerPlayActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);    
};

WishflowerPlayActivity.prototype.onLeaveActivity = function ()
{
};
