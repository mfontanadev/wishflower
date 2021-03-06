WishflowerIntroActivity.self = null;

function WishflowerIntroActivity(_id, _viewParent)
{
	WishflowerIntroActivity.self = this;

	this.m_id = _id;
	this.m_viewParent = _viewParent; 

	this.m_flow = null;
}

WishflowerIntroActivity.prototype.getActivityName = function ()
{   
	return "WishflowerIntroActivity";
}

WishflowerIntroActivity.prototype.initialize = function ()
{   
	msglog(this.getActivityName());

	this.m_flow = new IntroFlow();
	this.m_flow.init(this.m_viewParent, this);
	this.m_flow.setState(IntroFlow.C_INTRO_FLOW_APPSTATE_INITIALIZING);
	
	this.createControls();
};

WishflowerIntroActivity.prototype.createControls = function ()
{
    var tmpCanvas = this.m_viewParent.m_canvasEx;
};

// ****************************************
// Animation configuration
// ****************************************
WishflowerIntroActivity.prototype.onEnterActivity = function ()
{
};

WishflowerIntroActivity.prototype.handleInputs = function ()
{
	var mouse = this.m_viewParent.getMouseManagerInstance();
	if (mouse.m_mouseClick === true && this.m_startWalking === false)
	{
		if (collisionPointRect(mouse.m_mousePosX, mouse.m_mousePosY, this.m_ladybug.collisionRectangle()) === true)
		{
			//this.m_startWalking = true;
		}
	}

	if (this.m_viewParent.getKeyboardManagerInstance().isKeyDown(C_KEY_BACKSPACE) === true)
    {
        this.m_viewParent.getKeyboardManagerInstance().disableUntilKeyUp(C_KEY_BACKSPACE);
        this.btnBack_controller(null, null);   
    }
};

WishflowerIntroActivity.prototype.implementGameLogic = function ()
{
	this.m_flow.implementGameLogic();
};

WishflowerIntroActivity.prototype.render = function ()
{
	this.m_flow.render();

	this.renderControls();
};

WishflowerIntroActivity.prototype.renderControls = function ()
{
};

WishflowerIntroActivity.prototype.btnBack_controller = function (_e, _sender)
{
	WishflowerIntroActivity.self.m_viewParent.navigateTo(WishflowerContext.C_ACTIVITY_MENU);
};

WishflowerIntroActivity.prototype.onLeaveActivity = function ()
{
};

