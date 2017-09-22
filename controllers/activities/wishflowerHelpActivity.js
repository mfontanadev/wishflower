WishflowerHelpActivity.self = null;


function WishflowerHelpActivity(_id, _viewParent)  
{
	WishflowerHelpActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_flow = null;
};


WishflowerHelpActivity.prototype.getActivityName = function ()
{   
	return "WishflowerHelpActivity";
}

WishflowerHelpActivity.prototype.initialize = function ()
{   
	msglog(this.getActivityName());
	
	this.m_flow = new HelpFlow();
	this.m_flow.init(this.m_viewParent, this);
	this.m_flow.setState(HelpFlow.C_HELP_FLOW_APPSTATE_INITIALIZING);
	
	this.createControls();
};

WishflowerHelpActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;
};

WishflowerHelpActivity.prototype.onEnterActivity = function ()
{
	this.m_flow.setAnimationsWithCurrentLadyBugOffset();
};

WishflowerHelpActivity.prototype.handleInputs = function ()
{
	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_BACKSPACE) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_BACKSPACE);
        this.btnBack_controller(null, null);   
    }

    if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_RETURN) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_RETURN);
    }
};

WishflowerHelpActivity.prototype.implementGameLogic = function ()
{
	this.m_flow.implementGameLogic();
};

WishflowerHelpActivity.prototype.render = function ()
{
	this.m_flow.render();

	this.renderControls();
};

WishflowerHelpActivity.prototype.renderControls = function ()
{
};

WishflowerHelpActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerHelpActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);	
};


WishflowerHelpActivity.prototype.onLeaveActivity = function ()
{
};
